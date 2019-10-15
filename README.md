# Pre-reqs

1. Install Use node 10.x or above.

1. Run npm install from the root

2. Run the tests as a sanity check:

```
> npm test
```

# Running the API

The API uses a Redis instance to store the fetched users from RandomUser API. The connection string is passed in as a env variable named REDIS_CONN_STR. 

I setup a new Redis instance in Azure and gave its connection string to the REDIS_CONN_STR env variable. Alternatively, you can run a locally installed Redis server or you can run a Redis container on your box.

To run the app use:

On Linux for a locally running Redis server on port 6379:
```
> REDIS_CONN_STR=redis://localhost:6379 npm start
```

On Windows Command Prompt:
```
> SET REDIS_CONSTR=<>
> npm start
```

On Windows Powershell:
```
> $enf:REDIS_CONN_STR=<>
> npm start
```