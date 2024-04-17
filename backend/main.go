package main

import (
	"encoding/csv"
	"fmt"
	"gonum.org/v1/plot"
	"gonum.org/v1/plot/plotter"
	"gonum.org/v1/plot/plotutil"
	"gonum.org/v1/plot/vg"
	"os"
	"strconv"
	"time"
)

func generateSeriesFromArray(records [][]string, p *plot.Plot) (plotter.XYs, float64, float64, float64, float64) {
	// returns points, max_x, max_y, min_x, min_y

	// Setup var
	var max_x, _ = strconv.ParseFloat(records[0][2], 64)
	var max_y, _ = strconv.ParseFloat(records[0][3], 64)
	var min_x = max_x
	var min_y = max_y
	points := make(plotter.XYs, len(records))

	// Per record
	for i, eachrecord := range records {
		// Parse variable
		var x, _ = strconv.ParseFloat(eachrecord[2], 64)
		var y, _ = strconv.ParseFloat(eachrecord[3], 64)

		// Find max
		if max_x < x {
			max_x = x
		} else if min_x > x {
			min_x = x
		}
		// Find min
		if max_y < y {
			max_y = y
		} else if min_y > y {
			min_y = y
		}

		// Logging
		fmt.Println(eachrecord)
		fmt.Printf("%s: %.2f, %s: %.2f\n", eachrecord[2], x, eachrecord[3], y)
		points[i].X = x
		points[i].Y = y
	}

	// Results image
	return points, max_x, max_y, min_x, min_y
}

func main() {
	// Performance checks
	start := time.Now()
	// Filepath
	const filepath = "Dataset/EPA_SmartLocationDatabase_V3_Jan_2021_Final.csv"
	// Read file
	file, _ := os.Open(filepath)
	defer file.Close()
	reader := csv.NewReader(file)
	records, _ := reader.ReadAll()

	// Get titles
	var x_title string = records[0][2]
	var y_title string = records[0][3]
	var title string = x_title + " vs. " + y_title

	// Setup graph
	p := plot.New()
	p.Title.Text = title
	p.X.Label.Text = x_title
	p.Y.Label.Text = y_title
	// Setup line
	points, max_x, max_y, min_x, min_y := generateSeriesFromArray(records[1:], p)

	// Results logging
	fmt.Println(title)
	fmt.Printf("Max x: %.2f, Max y: %.2f\n", max_x, max_y)
	fmt.Printf("Min x: %.2f, Min y: %.2f\n", min_x, min_y)
	_ = plotutil.AddLinePoints(p, "", points)
	_ = p.Save(4*vg.Inch, 4*vg.Inch, "points.png")

	// Performance checks
	duration := time.Since(start)
	fmt.Println(duration)
}
