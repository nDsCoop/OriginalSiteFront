import React from "react";
import App2 from "../components/App2";
import { GlobalState } from "../components/GlobalState";
import '../App.css';

function App() {
  return (
   <GlobalState>
      <App2 />
    </GlobalState> 
  );
}

export default App;

// this do not works