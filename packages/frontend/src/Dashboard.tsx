import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis } from "recharts";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

import { fetchStockPrice } from "./api";
import { StockPrice } from "./types";

function Dashboard() {
  const apiKey = localStorage.getItem("api-key");
  const [date, setDate] = useState<Date>(new Date());
  const [stockData, setStockData] = useState<StockPrice[]>([]);

  const handleFetchStockPrice = async (apiKey: string | null, date?: Date) => {
    if (!apiKey) return;

    const time = date || new Date();
    const result = await fetchStockPrice(apiKey, time);
    setStockData((prevData) => [
      ...prevData,
      { ...result, date: time.toISOString().split('T')[0] }
    ]);
  };

  useEffect(() => {
    handleFetchStockPrice(apiKey, date);
  }, [apiKey, date]); // eslint-disable-line

  return (
    <div className="page">
      <div className="header">
        <p className="page-header">Your API key is:</p>

        <div className="button-wrapper">
          <p className="api-key-holder">{apiKey}</p>
          <button
            className="refresh-button"
            onClick={() => handleFetchStockPrice(apiKey)}
          >
            Refresh Data
          </button>
        </div>
      </div>

      <div className="graph">
        <LineChart width={500} height={300} data={stockData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.3)" />
          <XAxis dataKey="name" />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#000" />
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

export default Dashboard;
