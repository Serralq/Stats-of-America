## HTTP Server Endpoints
### /data/:state
- Type: `POST`
- Retrieves a data comparison given a single state.
- `:state` is the requested state for comparison data.
#### Request Body
```json
{
	"comparison": ["[x-axis]", "[y-axis]"]
}
```
#### Return Body
Returns a JSON object with the following structure.
```json
{
	"x": "[x-axis]",
	"y": "[y-axis]",
	"data": [
		[1, 2],
		[3, 4],
		// ...the rest of the data
	]
}
```  
### /comparison
- Type: `GET`
- Retrieves the entire similarities for every state for each data comparison done on every other state.
#### Return Body
Returns a JSON object with the following structure.
```json
{
	"[state]": [
		{
			"state": "[state]",
			"comparedData":[
				["x-axis-1", "y-axis-1"],
				["x-axis-2", "y-axis-2"]
			],
			"path": [
				"data-path-1",
				"data-path-2"
			],
			"similarity": 1.9563774772818556
		}
		// ...rest of the comparisons for each state
	]
	// ...rest of the states
}
```