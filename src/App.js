import React from "react";
import "./App.css";
import * as data from "./data.json";
import * as dataWeek from "./data7d.json";
import {
  format,
  isSameDay,
  fromUnixTime,
  isWeekend,
  isThisWeek,
} from "date-fns";

const advice = {
  "10d": "Better take an umbrella with you!",
  "01d": "Clear sky, clear mind.",
  "03d": "A gray day provides the best light.",
};

const parseDay = (day) => {
  return {
    date: fromUnixTime(day.dt),
    temperature: arrAvg(Object.values(day.temp)) || day.temp,
    description: day.weather[0].description,
    icon: day.weather[0].icon,
  };
};

const arrAvg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

const parseWeekend = (raw) => {
  const parsed = raw.daily.map((day) => parseDay(day));
  return parsed.filter(
    (day) => isWeekend(day.date) && isThisWeek(day.date, { weekStartsOn: 1 })
  );
};

function WeatherDisplay({ date, description, temperature, icon }) {
  const day = isSameDay(new Date(), date) ? "Today" : format(date, "EEEE");
  const iconURL = `http://openweathermap.org/img/wn/${icon}@4x.png`;
  return (
    <div>
      <div className="Date">
        <h3>{day}</h3>
        <p>{format(date, "PP")}</p>
      </div>
      <img src={iconURL} alt="icon" />
      <p>{description}</p>
      <p id="temperature">{temperature}</p>
      <p>{advice[icon]}</p>
    </div>
  );
}

const handleClick = () => {};

function Button(props) {
  return (
    <button className={props.name} type="button" onClick={handleClick()}>
      {props.children}
    </button>
  );
}

function App() {
  const [showWeekend, setShowWeekend] = React.useState(true);
  const todayData = parseDay(dataWeek.default.current);
  const weekendData = parseWeekend(dataWeek.default);
  console.log(weekendData);

  return (
    <div className="App">
      <header className="App-header">
        <div className="Card">
          <WeatherDisplay {...todayData} />
        </div>
        <Button name="dateButton">Today</Button>
        <Button name="dateButton">Weekend</Button>
      </header>
    </div>
  );
}

export default App;
