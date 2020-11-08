import React from "react";
import App2 from "../components/App2";
import { GlobalState } from "../components/GlobalState";
import '../App.css';
import {Helmet} from "react-helmet";

function App() {
  return (
   <GlobalState>
      <Helmet>
          <title>Music | nDsBuilding</title>
      </Helmet>
      <App2 />
    </GlobalState> 
  );
}

export default App;

// this do not works