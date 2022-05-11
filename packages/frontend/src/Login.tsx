import React from 'react';
import { v4 } from 'uuid';
import './App.css';


function LogIn() {
  return (
    <div className="page">
       
        <div
          className="App-link"
          onClick={() => {
            localStorage.setItem('api-key', v4());
            window.location.reload();
          }}
        >
          Click here to log in
        </div>
    </div>
  );
}

export default LogIn;
