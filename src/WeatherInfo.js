import React from "react";
import PropTypes from "prop-types";
import {
  format,
  isSameDay,
  fromUnixTime,
  isWeekend,
  isThisWeek,
  differenceInCalendarDays,
} from "date-fns";
import Switch from "react-switch";
import { Spinner } from "./Spinner";

const arrAvg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
const isNextWeekend = (date) => {
  const diff = differenceInCalendarDays(date, new Date());
  return diff >= 6 && diff <= 9 && isWeekend(date);
};

const advice = {
  "01d": "Clear sky, clear mind.",
  "01n": "Enjoy the stars tonight.",
  "10d": "Better take an umbrella with you!",
  "09d": "Heavy showers ahead!",
  "02d": "A gray day provides the best light.",
  "03d": "A nice day to spend outside",
  "04d": "Don't look so gloomy, it's just the weather",
  "11d": "Better stay inside!",
  "13d": "Make sure to put on some gloves today",
  "50d": "Be careful when you drive!",
};

const formatWeather = (day) => {
  return [
    {
      date: fromUnixTime(day.dt),
      temperature: arrAvg(Object.values(day.temp)) || day.temp,
      description: day.weather[0].description,
      iconId: day.weather[0].icon,
    },
  ];
};

const getUpcomingWeekend = (raw) => {
  const parsed = raw.daily.flatMap((day) => formatWeather(day));
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
  const tempColor = temperature >= 12 ? "warm" : "cold";
  return (
    <li className="weatherDisplay">
      <div className="date">
        <h3>{day}</h3>
        <p>{format(date, "PP")}</p>
      </div>
      <img src={iconURL} alt="icon" />
      <p>{description}</p>
      <p className={`temperature ${tempColor}`}>{Math.round(temperature)} ºC</p>
      <p>{advice[iconId] ? advice[iconId] : "Just another day"}</p>
    </li>
  );
}

WeatherDisplay.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  description: PropTypes.string.isRequired,
  temperature: PropTypes.number.isRequired,
  iconId: PropTypes.string.isRequired,
};

export function WeatherInfo({ displayChoice }) {
  const [weatherData, setWeatherData] = React.useState(null);
  const [wateringOn, setWateringOn] = React.useState(false);
  React.useEffect(() => {
    fetch(
      "https://api.openweathermap.org/data/2.5/onecall?lat=52.5200&lon=13.4050&exclude=hourly,minutely&&units=metric&appid=43bbfae6b2cee11fcefb3bc03472ef9a"
    )
      .then((response) => response.json())
      .then((data) => setWeatherData(data));
  }, []);

  if (!weatherData) {
    return <Spinner />;
  }
  const data =
    displayChoice === "today"
      ? formatWeather(weatherData.current)
      : getUpcomingWeekend(weatherData);
  return (
    <div>
      <div className="weatherDisplayContainer">
        {data.map((day) => (
          <WeatherDisplay {...day} key={day.date} />
        ))}
      </div>
      {displayChoice === "weekend" ? (
        <div className="contentContainer">
          <p>
            Activate automatic watering system{" "}
            <span role="img" aria-label="Seedling">
              🌱
            </span>
            :{" "}
          </p>
          <Switch
            onChange={() => setWateringOn(!wateringOn)}
            checked={wateringOn}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
