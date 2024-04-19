package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"time"
)

type Comparison struct {
	Title string
	Score float64
}

type Set_data struct {
	Title string
	Data  []Comparison
	Top   []Comparison
}

type Result struct {
	Set_data []Set_data
}

func generateSplitsFromRecords(records [][]string) {
	// Get titles
	var x_title string = records[0][1]
	var y_title string = records[0][2]
	var title string = x_title + " vs " + y_title

	// Setup multi-dimensional array
	perState := make(map[string][][]float64)
	// Create output directory
	os.MkdirAll("Output/Csv/"+title, 777)
	os.MkdirAll("Output/Split/"+title, 777)

	// Per record
	for _, eachrecord := range records[1:] {
		if eachrecord[0] == "" {
			continue
		}

		var state string = eachrecord[0][len(eachrecord[0])-2:]
		// Parse variable
		var x, _ = strconv.ParseFloat(eachrecord[1], 64)
		var y, _ = strconv.ParseFloat(eachrecord[2], 64)
		temp := make([]float64, 0)
		temp = append(temp, x)
		temp = append(temp, y)
		perState[state] = append(perState[state], temp)
	}

	// Per state
	for state, v := range perState {
		// Sort data, smaller -> larger
		sort.SliceStable(v, func(i, j int) bool {
			return v[i][0] < v[j][0]
		})

		// Find max/min values
		var max_x = v[len(v)-1][0]
		var max_y = v[0][1]
		var min_x = v[0][0]
		var min_y = v[0][1]
		{
			for _, row := range v {
				if row[1] > max_y {
					max_y = row[1]
				} else if row[1] < min_y {
					min_y = row[1]
				}
			}
		}

		// Setup output file
		{
			// Create csv file
			file_csv, _ := os.Create("Output/Csv/" + title + "/" + state + ".csv")
			defer file_csv.Close()
			// Write split headers
			writer_csv := csv.NewWriter(file_csv)
			defer writer_csv.Flush()
			headers := []string{x_title, y_title}
			writer_csv.Write(headers)
			// Create split file
			file, _ := os.Create("Output/Split/" + title + "/" + state + ".csv")
			defer file.Close()
			fmt.Println("Writing " + title + "/" + state)
			// Write split headers
			writer := csv.NewWriter(file)
			defer writer.Flush()
			writer.Write(headers)
			// Setup look-ahead + look-behind variables
			var breakpoint float64 = 1.00 / 100.00
			var record_counter int64 = 1

			// Per record, look ahead pattern so stop 1 before the end
			for i := range v[:len(v)-1] {
				// Calculate X value
				behind := (v[i][0] - min_x) / (max_x - min_x)
				ahead := (v[i+1][0] - min_x) / (max_x - min_x)

				// If between behind, breakpoint, ahead
				// until not between anymore
				for behind < breakpoint && ahead > breakpoint {

					// Temp value
					temp := make([]string, 0)
					// X value
					temp = append(temp, strconv.FormatInt(record_counter, 10))
					// Y value
					// Final value a proportional to how far is to breakpoint
					var total_dist float64 = ahead - behind
					var behind_dist = breakpoint - behind
					var behind_part = behind_dist / total_dist
					var ahead_part = 1.00 - behind_part
					var behind_y = (v[i][1] - min_y) / (max_y - min_y)
					var ahead_y = (v[i+1][1] - min_y) / (max_y - min_y)
					temp_float := behind_y*behind_part + ahead_y*ahead_part
					temp = append(temp, strconv.FormatFloat(temp_float, 'f', -1, 64))
					// Writer
					writer.Write(temp)

					// Incrementation
					record_counter++
					breakpoint += 1.00 / 100.00
					// Not need to check since breakpoint will never be above 100
				}

				// Create regular split files
				temp := make([]string, 0)
				temp = append(temp, strconv.FormatFloat(v[i][0], 'f', -1, 64))
				temp = append(temp, strconv.FormatFloat(v[i][1], 'f', -1, 64))
				writer_csv.Write(temp)
			}
		}
	}
}

func generateSplit() {
	// Filepath
	const dirpath = "Dataset/"
	f, _ := os.Open(dirpath)
	defer f.Close()
	files, _ := f.Readdir(0)

	// Per file
	for _, v := range files {
		// Read file
		file, _ := os.Open(dirpath + v.Name())
		defer file.Close()
		reader := csv.NewReader(file)
		records, _ := reader.ReadAll()
		generateSplitsFromRecords(records)
	}
}

func compareCSV(src, antag string) float64 {
	f_src, _ := os.Open(src)
	defer f_src.Close()
	f_antag, _ := os.Open(antag)
	defer f_antag.Close()
	r_src := csv.NewReader(f_src)
	r_antag := csv.NewReader(f_antag)
	d_src, _ := r_src.ReadAll()
	d_antag, _ := r_antag.ReadAll()

	var score float64 = 0.00

	for i, _ := range d_src {
		v_src, _ := strconv.ParseFloat(d_src[i][1], 64)
		v_antag, _ := strconv.ParseFloat(d_antag[i][1], 64)
		score += math.Abs(v_src - v_antag)
	}
	return score
}

func generateJSON() {
	// Filepath
	const dirpath = "Output/Split/"
	// All files
	var paths = make([]string, 0)
	filepath.Walk(dirpath,
		func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			if !info.IsDir() {
				paths = append(paths, path)
			}
			return nil
		})

	// Setup json results
	result := Result{}

	// Each csv file against every other csv file
	for i, f := range paths {
		temp := Set_data{}
		temp.Title = paths[i]
		for j, f2 := range paths {
			if f != f2 {
				score := compareCSV(f, f2)
				temp.Data = append(temp.Data, Comparison{Title: paths[j], Score: score})
			}
		}
		// Sort the array, smaller -> larger
		sort.SliceStable(temp.Data, func(i, j int) bool {
			return temp.Data[i].Score < temp.Data[j].Score
		})
		// Top three results
		temp.Top = append(temp.Top, temp.Data[0])
		temp.Top = append(temp.Top, temp.Data[1])
		temp.Top = append(temp.Top, temp.Data[2])

		// Append results
		result.Set_data = append(result.Set_data, temp)
	}

	// Create json file
	bytes, _ := json.Marshal(result)
	ioutil.WriteFile("Output/comparisons.json", bytes, 0777)
}

func main() {
	// Performance checks
	start := time.Now()

	// Generate Split Csv files from Dataset
	generateSplit()
	duration := time.Since(start)
	fmt.Println("Generate Split: " + duration.String())

	// Generate JSON file
	generateJSON()

	// Performance checks
	duration = time.Since(start)
	fmt.Println("Generate JSON: " + duration.String())
}
