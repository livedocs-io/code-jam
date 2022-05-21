import React, { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis } from "recharts";
import DatePicker from "react-datepicker";

import "./App.css";
import "react-datepicker/dist/react-datepicker.css";
import rest from './restApi';

interface ResponseData {
  name: string,
  value: number
}

function LogIn() {
  const [date, setDate] = useState<Date>(new Date());
  const [retries, setRetries] = useState<number>(0);
  const [data, setData] = useState<Array<ResponseData>>([]);

  const apiKey = localStorage.getItem("api-key") ?? "";

  useEffect(() => {
      rest.getGraphData(date, apiKey)
      .then((res: any) => {
        console.log(res)
        setData(res.data)
        setRetries(res.rate_limit)
      });
  }, [apiKey, date]);

  const onRefresh = () => {
    if(retries > 0){
       alert('refreshing... loading animation button would have been better..!!')
      rest.refreshData(date, apiKey)
      .then((res: any) => {
        setData(res.data)
        setRetries(res.rate_limit)
      });
    }else{
      alert('You are out of retry limits...!!')
    }
  }

  const floodDb = () => {
    alert('Flooding db with fake data. For test purposes only !!')
    rest.floodData(date, apiKey)
    .then((res: any) => console.log(res));
  }

  return (
    <div className="page">
      <div>
        <p className="page-header">Your API key is:</p>
        <p className="api-key-holder">{apiKey}</p>
        <p onClick={floodDb} style={{
          marginLeft: 20
        }} className="api-key-holder">Flood DB</p>
        <p onClick={onRefresh} style={{
          marginLeft: 20
        }} className="api-key-holder">Refresh: {retries}</p>
      </div>

      <div className="graph">
        <LineChart width={500} height={300} data={data}>
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
