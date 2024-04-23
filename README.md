# Stats of America
*United we stand, divided we fall; we are unified by statistics.*
The United States of America is diversified more than ever; however, there is one thing that we have in common: statistics. We are ALL unified by statistics! This project takes various data sets, normalizes them, and combines them to show us Americans how similar we all really are.

# Frontend
## Starting the Frontend
### Requirements
- [NodeJS](https://nodejs.org/en)
- [yarn](https://yarnpkg.com/) (not required but preferred)
### Steps 
> [!CAUTION]
> In order for the frontend to properly fetch data, a backend must be started and the frontend must be configured to use this backend. See [Backend](#backend) for more information.

1. Navigate to the `frontend` directory.
2. Configure `next.config.mjs` to use the correct environment variables.
4. Run `yarn` to install all dependencies.
5. Run `yarn dev` to start a development instance of the server.

# Backend
## Starting the Backend
### Requirements
- [Go](https://go.dev/)

### Steps
There are two ways to run the backend, through Docker and running it via the CLI. We will only be going over running it in the CLI.

1. Navigate to the `backend` directory.
2. Configure `.env.local` using `.env.local.example`.
3. Run `go run main.go`.

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
### /comparison/:state?page=0
- Type: `GET`
- Retrieves the entire similarities for a state for each data comparison done on every other state.
- Only returns comparison data in chunks of 10 starting from 0
- Returns an empty json file if there's no more pages
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
### /partial_comparison/:state
- Type: `GET`
- Retrieves the entire similarities for a state for each data comparison done on every other state if they are not from the same graph
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
### /partial_comparison/:state?page=0
- Type: `GET`
- Retrieves the entire similarities for a state for each data comparison done on every other state if they are not from the same graph
- Only returns comparison data in chunks of 10 starting from 0
- Returns an empty json file if there's no more pages
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
