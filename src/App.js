import React from "react";
import "./App.css";
import {
  format,
  isSameDay,
  fromUnixTime,
  isWeekend,
  isThisWeek,
  differenceInCalendarDays,
} from "date-fns";

function WeatherInfo({ displayChoice }) {
  const [weatherData, setWeatherData] = React.useState(null);
  React.useEffect(() => {
    fetch(
      "https://api.openweathermap.org/data/2.5/onecall?lat=52.5200&lon=13.4050&exclude=hourly,minutely&&units=metric&appid=43bbfae6b2cee11fcefb3bc03472ef9a"
    )
      .then((response) => response.json())
      .then((data) => setWeatherData(data));
  }, []);

  if (!weatherData) {
    //  TODO: add a loading spinner??
    return "...";
  }
  const data =
    displayChoice === "today"
      ? parseDay(weatherData.current)
      : parseWeekend(weatherData);
  console.log(JSON.stringify(data, null, 2));
  return (
    <div className="Card">
      {data.map((day) => (
        <WeatherDisplay {...day} />
      ))}
    </div>
  );
}

const advice = {
  "01d": "Clear sky, clear mind.",
  "01n": "Enjoy the stars tonight.",
  "10d": "Better take an umbrella with you!",
  "09d": "Heavy showers ahead!",
  "02d": "A gray day provides the best light.",
  "03d": "A nice day to spend outside",
  "04d": "Don't look so gloomy, it's just the weather",
  "11d": "Better stay inside!",
  "09d": "Just a few drops",
  "13d": "Make sure to put on some gloves today",
  "50d": "Be careful when you drive!",
};

const parseDay = (day) => {
  return [
    {
      date: fromUnixTime(day.dt),
      temperature: arrAvg(Object.values(day.temp)) || day.temp,
      description: day.weather[0].description,
      iconId: day.weather[0].icon,
    },
  ];
};

const arrAvg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
const isNextWeekend = (date) => {
  const diff = differenceInCalendarDays(date, new Date());
  return diff >= 6 && diff <= 9 && isWeekend(date);
};

const parseWeekend = (raw) => {
  const parsed = raw.daily.flatMap((day) => parseDay(day));
  if (isWeekend(new Date())) {
    return parsed.filter((day) => isNextWeekend(day.date));
  }
  return parsed.filter(
    (day) => isWeekend(day.date) && isThisWeek(day.date, { weekStartsOn: 1 })
  );
};

function WeatherDisplay({ date, description, temperature, iconId }) {
  const day = isSameDay(new Date(), date) ? "Today" : format(date, "EEEE");
  const iconURL = `http://openweathermap.org/img/wn/${iconId}@4x.png`;
  return (
    <div className="WeatherDisplay" key={day}>
      <div className="Date">
        <h3>{day}</h3>
        <p>{format(date, "PP")}</p>
      </div>
      <img src={iconURL} alt="icon" />
      <p>{description}</p>
      <p id="temperature">{Math.round(temperature)} ºC</p>
      <p>{advice[iconId] ? advice[iconId] : "Just another day"}</p>
    </div>
  );
}

function App() {
  const [displayChoice, setDisplayChoice] = React.useState("today");

  return (
    <div className="App">
      <header className="App-header">
        <WeatherInfo displayChoice={displayChoice} />
        <div className="buttonContainer">
          <button name="dateButton" onClick={() => setDisplayChoice("today")}>
            Today
          </button>
          <button name="dateButton" onClick={() => setDisplayChoice("weekend")}>
            Weekend
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
