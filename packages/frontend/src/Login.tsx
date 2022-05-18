import React from "react";
import { v4 } from "uuid";

import "./App.css";
import { createUser } from "./services/requests/user";

function LogIn() {
  return (
    <div
      className="page"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="App-link"
        onClick={async () => {
          const newOrExistingUser = v4();
          localStorage.setItem("api-key", newOrExistingUser);
          await createUser(newOrExistingUser);
          window.location.reload();
        }}
      >
        Click here to log in
      </div>
    </div>
  );
}

export default LogIn;
