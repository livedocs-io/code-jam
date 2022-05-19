import React, { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis } from "recharts";
import DatePicker from "react-datepicker";

import "./App.css";
import "react-datepicker/dist/react-datepicker.css";

let stockData = [
  {
    name: "Page A",
    uv: 4000,
  },
  {
    name: "Page B",
    uv: 3000,
  },
  {
    name: "Page C",
    uv: 2000,
  },
  {
    name: "Page D",
    uv: 2780,
  },
  {
    name: "Page E",
    uv: 1890,
  },
  {
    name: "Page F",
    uv: 2390,
  },
  {
    name: "Page G",
    uv: 3490,
  },
];

function LogIn() {
  const [date, setDate] = useState<Date>(new Date());
  const [stockSymbol, setStockSymbol] = useState('LDOCS');

  const apiKey = localStorage.getItem("api-key");

  useEffect(() => {
    fetch("http://localhost:4000/"+stockSymbol+"/"+date.toDateString(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        ApiKey: `${apiKey}`,
      },
      body: JSON.stringify({
        date,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        stockData = data;
      });
  }, [apiKey, date, stockSymbol]);

  return (
    <div className="page">
      <div>
        <p className="page-header">Your API key is:</p>
        <p className="api-key-holder">{apiKey}</p>
      </div>

      <div className="graph">
        Stock quote for {stockSymbol} <br/>
        <LineChart width={800} height={500} data={stockData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.3)" />
          <XAxis dataKey="name" />
          <Tooltip />
          <Line type="monotone" dataKey="uv" stroke="#000" />
        </LineChart>
      </div>
      <div>
        <DatePicker
          selected={date}
          onChange={(date: Date) => setDate(date)}
          withPortal
        />
        <div>
          <select id="stockPick" onChange={e => setStockSymbol(e.target.value.toUpperCase())}>
            <option value="LDOCS">LiveDocs</option>
            <option value="APPL">Apple</option>
            <option value="GOOGL">Alphabet</option>
            <option value="MSFT">Microsoft</option>
            <option value="TSLA">Tesla</option>
            <option value="AMZN">Amazon</option>
          </select>
        </div>
        <hr/>

        <div
          className="App-link"
          onClick={() => {
            localStorage.removeItem("api-key");
            window.location.reload();
          }}
        >
          Delete session
        </div>
      </div>
    </div>
  );
}

export default LogIn;

