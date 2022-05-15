import React, { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis } from "recharts";
import DatePicker from "react-datepicker";

import "./App.css";
import "react-datepicker/dist/react-datepicker.css";


type DataPoint = {
  value: number | null
  date: string
}

function LogIn() {
  const [date, setDate] = useState<Date>(new Date());
  const [ticker, setTicker] = useState<string>("AAPL");
  const [data, setData] = useState<DataPoint[]>([]);
  const [force, setForce] = useState(false);

  const apiKey = localStorage.getItem("api-key");

  useEffect(() => {
    fetch(`http://localhost:4000/${ticker}?force=${force}`, {
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
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        else {
          throw(new Error("Failed to fetch data"))
        }
      })
      // extract to function
      .then((data: DataPoint[]) => setData(data.map((v) => ({ value: v.value, date: new Date(parseInt(v.date)).toDateString() }))))
      .catch((error) => {
        setData([])
        alert(error)
      });
  }, [apiKey, date, ticker, force]);

  return (
    <div className="page">
      <div>
        <p className="page-header">Your API key is:</p>
        <p className="api-key-holder">{apiKey}</p>
      </div>

      <label htmlFor="tickers">Choose a ticker:</label>

      <div>
        <select name="tickers" id="tickers" value={ticker} onChange={(e) => setTicker(e.target.value)}>
          <option value="LDOCS">Livedocs</option>
          <option value="AAPL">Apple</option>
          <option value="GOOGL">Alphabet</option>
          <option value="MSFT">Microsoft</option>
          <option value="TSLA">Tesla</option>
          <option value="AMZN">Amazon</option>
        </select>
        <label>
          <input type="checkbox" checked={force} onChange={() => setForce(!force)} />
          Force refresh
        </label>
      </div>
      <div className="graph">
        <LineChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.3)" />
          <XAxis dataKey="date" />
          <Tooltip />
          <Line connectNulls type="monotone" dataKey="value" stroke="#000" />
        </LineChart>
      </div>
      <div>
        <DatePicker
          selected={date}
          onChange={(date: Date) => setDate(date)}
          withPortal
        />
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
