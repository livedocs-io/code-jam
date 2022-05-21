import React from "react";
import "./App.css";
import Dashboard from "./Dashboard";
import LogIn from "./Login";

function App() {
  const isLogged = localStorage.getItem("api-key") !== null;

  return (
    <div className="App">
      <p
        className="App-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Livedocs code jam!
      </p>
      {isLogged ? <Dashboard /> : <LogIn />}
    </div>
  );
}

export default App;
