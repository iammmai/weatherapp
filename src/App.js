import React from "react";
import "./App.css";
import { WeatherInfo } from "./WeatherInfo";

function App() {
  const [displayChoice, setDisplayChoice] = React.useState("today");

  return (
    <div className="App">
      <header className="App-header">
        <div className="card">
          <WeatherInfo displayChoice={displayChoice} />
        </div>
        <div className="contentContainer">
          <button
            className="btn"
            name="dateButton"
            onClick={() => setDisplayChoice("today")}
          >
            Today
          </button>
          <button
            className="btn"
            name="dateButton"
            onClick={() => setDisplayChoice("weekend")}
          >
            Weekend
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
