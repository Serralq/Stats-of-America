package main

import (
	"encoding/csv"
	"fmt"
	"os"
	"sort"
	"strconv"
	"time"
)

func generateSplitsFromRecords(records [][]string, file_title string) {
	// Get titles
	var x_title string = records[0][1]
	var y_title string = records[0][2]

	// Setup multi-dimensional array
	perState := make(map[string][][]float64)
	// Create output directory
	os.MkdirAll("Output/Csv/"+file_title, 777)

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
		// Sort data
		sort.SliceStable(perState[state], func(i, j int) bool {
			return perState[state][i][0] < perState[state][j][0]
		})

		// Setup split csv
		{
			file, err := os.Create("Output/Csv/" + file_title + "/" + state + ".csv")
			if err != nil {
				fmt.Println(err)
			}
			defer file.Close()
			writer := csv.NewWriter(file)
			headers := []string{x_title, y_title}
			data := v
			// Setup max/min variables
			var max_x = v[len(v)-1][0]
			var max_y = v[len(v)-1][1]
			var min_x = v[0][0]
			var min_y = v[0][1]

			// Writing csv
			writer.Write(headers)
			for _, row := range data {
				// Temp value
				temp := make([]string, 0)
				// X value
				temp_int := (row[0] - min_x) / (max_x - min_x)
				temp = append(temp, strconv.FormatFloat(temp_int, 'f', -1, 64))
				// Y value
				temp_int = (row[1] - min_y) / (max_y - min_y)
				temp = append(temp, strconv.FormatFloat(temp_int, 'f', -1, 64))
				// Writer
				writer.Write(temp)
			}
		}
	}
}

func generateSplit() {
	// Filepath
	const dirpath = "Dataset/"
	f, _ := os.Open(dirpath)
	files, _ := f.Readdir(0)

	// Per file
	for _, v := range files {
		// Read file
		file, _ := os.Open(dirpath + v.Name())
		defer file.Close()
		reader := csv.NewReader(file)
		records, _ := reader.ReadAll()
		generateSplitsFromRecords(records, v.Name())
	}
}

func main() {
	// Performance checks
	start := time.Now()

	// Generate Split Csv files from
	generateSplit()

	// Performance checks
	duration := time.Since(start)
	fmt.Println(duration)
}
