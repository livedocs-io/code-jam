# Code-jam
Fictional stock viewer written in Typescript, React. 

# Getting started
- From the project root, start by running `npm install`
- Bootstrap the project `npm run setup`
- Start the server by running `npm start`

## Actual "Fakedaq" API docs

#### Notes
- API enforces a strict rate-limit of 10 requests per API key
- You can view the current rate-limit in the response header

#### Get price quote for a specific stock
`GET /stock/:symbol`

Request 
`curl --header "api-key: test-key" http://localhost:8080/stock/AAPL`

Response
`{"name":"Apple","symbol":"AAPL","price":176.48}`

#### Reset the rate-limit for an API key (don't use this in the solution!!)

Request
`curl --header "api-key: test-key" http://localhost:8080/reset`

Response 
`{"message":"Rate limit has been reset"}`

# Valid symbols
- Livedocs `LDOCS`
- Apple `AAPL`
- Alphabet `GOOGL`
- Microsoft `MSFT`
- Tesla `TSLA`
- Amazon `AMZN`
