package main

import (
  "encoding/csv"
  "fmt"
  "gonum.org/v1/plot"
  "gonum.org/v1/plot/plotter"
  "gonum.org/v1/plot/plotutil"
  "gonum.org/v1/plot/vg"
  "os"
  "sort"
  "strconv"
  "time"
)

func generateSeriesFromArray(records [][]string) {
  // returns points, max_x, max_y, min_x, min_y
  // Get titles
  var x_title string = records[0][1]
  var y_title string = records[0][2]
  var part_title string = x_title + " vs. " + y_title

  // Setup var
  perState := make(map[string][][]float64)
  //var max_x, _ = strconv.ParseFloat(records[0][1], 64)
  //var max_y, _ = strconv.ParseFloat(records[0][2], 64)
  //var min_x = max_x
  //var min_y = max_y
  // Setup graph

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

    // Find max
    //if max_x < x {
    //	max_x = x
    //} else if min_x > x {
    //	min_x = x
    //}
    // Find min
    //if max_y < y {
    //	max_y = y
    //} else if min_y > y {
    //	min_y = y
    //}

    // Logging
    fmt.Println(eachrecord)
  }

  for state, v := range perState {
    // Setup graph
    p := plot.New()
    p.Title.Text = part_title + " (" + state + ")"
    p.X.Label.Text = x_title
    p.Y.Label.Text = y_title
    points := make(plotter.XYs, len(v))

    // Sort data
    sort.SliceStable(perState[state], func(i, j int) bool {
      return perState[state][i][0] < perState[state][j][0]
    })

    // Plot data
    for i, pair := range v {
      points[i].X = pair[0]
      points[i].Y = pair[1]
    }

    // Save plot
    _ = plotutil.AddLinePoints(p, "", points)
    _ = p.Save(4*vg.Inch, 4*vg.Inch, "Output/"+state+".png")
    fmt.Println("Completing " + state)
  }
  // Results image
}

func main() {
  // Performance checks
  start := time.Now()
  // Filepath
  const filepath = "Dataset/EPA_SmartLocationDatabase_V3_Jan_2021_Final [Larger].csv"
  // Read file
  file, _ := os.Open(filepath)
  defer file.Close()
  reader := csv.NewReader(file)
  records, _ := reader.ReadAll()

  // Setup line
  generateSeriesFromArray(records)

  // Results logging
  //fmt.Println(title)
  //fmt.Printf("Max x: %.2f, Max y: %.2f\n", max_x, max_y)
  //fmt.Printf("Min x: %.2f, Min y: %.2f\n", min_x, min_y)

  // Performance checks
  duration := time.Since(start)
  fmt.Println(duration)
}
