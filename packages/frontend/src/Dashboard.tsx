import React, { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis } from "recharts";
import DatePicker from "react-datepicker";

import "./App.css";
import "react-datepicker/dist/react-datepicker.css";
import { getStocksFromUser } from "./services/requests/user";

function Dashboard() {
  const [date, setDate] = useState<Date>(new Date());
  const [stockData, setStockData] = useState<[]>([]);

  const apiKey = localStorage.getItem("api-key") || "";

  useEffect(() => {
    async function fetchAPI() {
      await getStocksFromUser(apiKey, date.toISOString())
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          setStockData(data);
        });
    }
    fetchAPI();
  }, [apiKey, date]);

  return (
    <div
      className="page"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        <p className="page-header">Your API key is:</p>
        <p className="api-key-holder">{apiKey}</p>
      </div>

      <div className="graph">
        <LineChart width={500} height={300} data={stockData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.3)" />
          <XAxis dataKey="name" />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#000" />
        </LineChart>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <button
          className="App-link"
          onClick={() => {
            localStorage.removeItem("api-key");
            window.location.reload();
          }}
        >
          Refresh stock
        </button>
        <DatePicker
          selected={date}
          onChange={(date: Date) => setDate(date)}
          withPortal
        />
        <button
          className="App-link"
          onClick={() => {
            localStorage.removeItem("api-key");
            window.location.reload();
          }}
        >
          Delete session
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
