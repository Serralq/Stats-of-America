package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"time"
)

type State struct {
	State         string     `json:"state"`
	Compared_Data [][]string `json:"comparedData"`
	Path          []string   `json:"path"`
	Similarity    float64    `json:"similarity"`
}

type Path struct {
	Path   string
	State  string
	X_axis string
	Y_axis string
}

type Single struct {
	X    string      `json:"x"`
	Y    string      `json:"y"`
	Data [][]float64 `json:"data"`
}

type Request struct {
	Comparison []string `json:"comparison"`
}

func quick_sort(arr [][]float64, low int, high int) ([][]float64, int) {
	// Sorting
	i := low
	for j := low; j < high; j++ {
		if arr[j][0] < arr[high][0] {
			temp := arr[i]
			arr[i] = arr[j]
			arr[j] = temp
			i++
		}
	}

	// Moving pivot to correct position
	temp := arr[i]
	arr[i] = arr[high]
	arr[high] = temp

	return arr, i
}

func quick_recur(arr [][]float64, low int, high int) [][]float64 {
	if low < high {
		// Sort -> Sort the halves
		var i int
		arr, i = quick_sort(arr, low, high)
		arr = quick_recur(arr, low, i-1)
		arr = quick_recur(arr, i+1, high)
	}
	return arr
}

func merge(arr1 [][]float64, arr2 [][]float64) [][]float64 {
	result := [][]float64{}
	i := 0
	j := 0

	for i < len(arr1) && j < len(arr2) {
		if arr1[i][0] < arr2[j][0] {
			result = append(result, arr1[i])
			i++
		} else {
			result = append(result, arr2[j])
			j++
		}
	}

	// Leftovers
	for ; i < len(arr1); i++ {
		result = append(result, arr1[i])
	}
	for ; j < len(arr2); j++ {
		result = append(result, arr2[j])
	}

	return result
}

func merge_sort(arr [][]float64) [][]float64 {
	// Base case
	if len(arr) < 2 {
		return arr
	}
	// Splitting up
	top := merge_sort(arr[len(arr)/2:])
	bot := merge_sort(arr[:len(arr)/2])
	// Combining together
	return merge(top, bot)
}

func bubble_sort(arr [][]float64) [][]float64 {
	for i := 0; i < len(arr)-1; i++ {
		for j := 0; j < len(arr)-1-i; j++ {
			if arr[j][0] > arr[j+1][0] {
				arr[j], arr[j+1] = arr[j+1], arr[j]
			}
		}
	}
	return arr
}

func generateSplitsFromRecords(records [][]string, algo string) {
	// Get titles
	var x_title string = records[0][1]
	var y_title string = records[0][2]
	var title string = x_title + " vs " + y_title

	// Setup multi-dimensional array
	perState := make(map[string][][]float64)
	// Create output directory
	os.MkdirAll("Output/JSON/"+title, 777)
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
		if algo == "quick" {
			v = quick_recur(v, 0, len(v)-1)
		} else if algo == "merge" {
			v = merge_sort(v)
		} else if algo == "bubble" {
			v = bubble_sort(v)
		}

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
			// Create json entry container
			single := Single{}
			// Setting headers
			single.X = x_title
			single.Y = y_title
			headers := []string{x_title, y_title}
			// Create split file
			file, _ := os.Create("Output/Split/" + title + "/" + state + ".csv")
			defer file.Close()
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
				single.Data = append(single.Data, []float64{v[i][0], v[i][1]})
			}
			// Write JSON split file
			bytes, _ := json.Marshal(single)
			ioutil.WriteFile("Output/JSON/"+title+"/"+state+".json", bytes, 0777)
		}
	}
}

func generateSplit(algo string) {
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
		generateSplitsFromRecords(records, algo)
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
	var paths = make([]Path, 0)
	filepath.Walk(dirpath,
		func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			if !info.IsDir() {
				title, _ := filepath.Rel("Output/Split", filepath.Dir(path))
				axis := strings.Split(title, " vs ")
				temp := Path{
					Path:   path,
					State:  strings.TrimSuffix(filepath.Base(path), filepath.Ext(path)),
					X_axis: axis[0],
					Y_axis: axis[1],
				}
				paths = append(paths, temp)
			}
			return nil
		})

	// Setup json results
	result := make(map[string][]State)

	// Each csv file against every other csv file
	for _, f := range paths {
		for _, f2 := range paths {
			// Create entry
			temp := State{}
			temp.State = f2.State
			temp.Compared_Data = [][]string{
				{f.X_axis, f.Y_axis},
				{f2.X_axis, f2.Y_axis},
			}
			temp.Path = []string{
				f.Path, f2.Path,
			}
			if f.State != f2.State {
				temp.Similarity = compareCSV(f.Path, f2.Path)
				result[f.State] = append(result[f.State], temp)
			}
		}

		// Sort the array, smaller -> larger
		sort.SliceStable(result[f.State], func(i, j int) bool {
			return result[f.State][i].Similarity < result[f.State][j].Similarity
		})

	}

	// Create json file
	bytes, _ := json.Marshal(result)
	ioutil.WriteFile("Output/comparisons.json", bytes, 0777)
}

func comparison_repsonse(w http.ResponseWriter, req *http.Request) {
	http.ServeFile(w, req, "Output/comparisons.json")
}
func state_response(w http.ResponseWriter, req *http.Request) {
	state := strings.TrimPrefix(req.URL.Path, "/data/")
	body := Request{}
	json.NewDecoder(req.Body).Decode(&body)

	http.ServeFile(w, req, "Output/JSON/"+body.Comparison[0]+" vs "+body.Comparison[1]+state+".json")
	//for name, headers := range req.Header {
	//	for _, h := range headers {
	//		fmt.Fprintf(w, "%v: %v\n", name, h)
	//	}
	//}
}
func http_server() {
	http.HandleFunc("/comparison", comparison_repsonse)
	http.HandleFunc("/data/", state_response)
	http.ListenAndServe(":3000", nil)
}

func main() {
	var start time.Time
	var duration time.Duration
	// Generate Split JSON files from Dataset
	// Bubble Sort
	start = time.Now()
	generateSplit("bubble")
	duration = time.Since(start)
	fmt.Println("Generate Split with Bubble Sort: " + duration.String())
	// Quick Sort
	start = time.Now()
	generateSplit("quick")
	duration = time.Since(start)
	fmt.Println("Generate Split with Quick Sort: " + duration.String())
	// Merge Sort
	start = time.Now()
	generateSplit("merge")
	duration = time.Since(start)
	fmt.Println("Generate Split with Merge Sort: " + duration.String())

	// Generate JSON file
	start = time.Now()
	generateJSON()
	duration = time.Since(start)
	fmt.Println("Generate JSON: " + duration.String())

	// Create http server
	fmt.Println("Running server on localhost:3000")
	http_server()
}
