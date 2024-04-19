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
    // TODO testing
    if state != "WY" {
      continue
    }
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
      // Create file
      file, err := os.Create("Output/Csv/" + file_title + "/" + state + ".csv")
      if err != nil {
        fmt.Println(err)
      }
      defer file.Close()
      fmt.Println("Writing " + state)
      // Write headers
      writer := csv.NewWriter(file)
      defer writer.Flush()
      headers := []string{x_title, y_title}
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
          err := writer.Write(temp)
          if err != nil {
            fmt.Println(err)
          }

          // Incrementation
          record_counter++
          breakpoint += 1.00 / 100.00
          // Not need to check since breakpoint will never be above 100
        }
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
