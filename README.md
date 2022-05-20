# Code-jam
Fictional stock viewer written in Typescript, React. 

# Getting started
- From the project root, start by running `npm install`
- Bootstrap the project `npm run setup`
- Start the server by running `npm start`

## Actual "Robinhood Fake API" API docs

It returns the API key's portfolio value taking into account how much of the given stock they own. For eg: 44 AAPL stocks would return AAPL value times 44. It knows the ownership amount. 

#### Notes
- API enforces a strict rate-limit of 10 requests per API key
- You can view the current rate-limit in the response header

#### Get price quote for a specific stock
`GET /stock/:symbol`

Request 
`curl --header "api-key: test-key" https://fakedaq-api.onrender.com/stock/AAPL`

Response
`{"name":"Apple","symbol":"AAPL","price":176.48}`

#### Reset the rate-limit for an API key (don't use this in the solution!!)

Request
`curl --header "api-key: test-key" https://fakedaq-api.onrender.com/reset`

Response 
`{"message":"Rate limit has been reset"}`

# Valid symbols
- Livedocs `LDOCS`
- Apple `AAPL`
- Alphabet `GOOGL`
- Microsoft `MSFT`
- Tesla `TSLA`
- Amazon `AMZN`
