# Frontend
## Starting the Frontend
### Requirements
- [NodeJS](https://nodejs.org/en)
- [yarn](https://yarnpkg.com/) (not required but preferred)
### Steps 
> [!CAUTION]
> In order for the frontend to properly fetch data, a backend must be started and the frontend must be configured to use this backend. See [Backend](#backend) for more information.

1. Navigate to the `frontend` directory.
2. Configure `.env.local.example` to use the correct environment values.
3. Rename `.env.local.example` to `.env.local`.
4. Run `yarn` to install all dependencies.
5. Run `yarn dev` to start a development instance of the server.

# Backend

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
### /comparison/:state
- Type: `GET`
- Retrieves the entire similarities for a state for each data comparison done on every other state.
#### Return Body
Returns a JSON object with the following structure.
```json
[
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
```
