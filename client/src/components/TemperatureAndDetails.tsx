import React from "react";
import {
  Thermostat as TemperatureIcon,
  OpacityOutlined as TearIcon,
  AirOutlined as WindIcon,
  WbSunnyOutlined as SunIcon,
  WbTwilightOutlined as SunsetIcon,
} from "@mui/icons-material";
import { formatToLocalTime, iconUrlFormCode } from "../services/WeatherService";

function TemperatureAndDetails(weather: any) {
  return (
    <div>
      <div className="flex items-center justify-center py-6 text-xl text-cyan-300">
        <p>{weather.weather.details}</p>
      </div>
      <div className="flex flex-row items-center justify-between text-white py-3">
        <img
          src={iconUrlFormCode(weather.weather.icon)}
          alt=""
          className="w-20"
        />
        <p className="text-5xl">{`${weather.weather.temp.toFixed()}°`}</p>
        <div className="flex flex-col space-y-2">
          <div className="flex font-light text-sm items-center justify-center">
            <TemperatureIcon fontSize="small" className="mr-l" />
            Real feel:
            <span className="font-medium ml-1">{`${weather.weather.feels_like.toFixed()}°`}</span>
          </div>
          <div className="flex font-light text-sm items-center justify-center">
            <TearIcon fontSize="small" className="mr-l" />
            Humidity:
            <span className="font-medium ml-1">{`${weather.weather.humidity.toFixed()}%`}</span>
          </div>
          <div className="flex font-light text-sm items-center justify-center">
            <WindIcon fontSize="small" className="mr-l" />
            Wind:
            <span className="font-medium ml-1">{`${weather.weather.speed.toFixed()}km/h`}</span>
          </div>
          <div className="flex font-light text-sm items-center justify-center"></div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center space-x-2 text-white text-sm py-3">

      <p className="font-light">
        <SunIcon />
        Sunrise:
        <span className="font-medium ml-1">
          {formatToLocalTime(
            weather.weather.sunrise,
            weather.weather.timeZone,
            "hh:mm a"
          )}
        </span>
      </p>
      <p className="font-light">|</p>

      <p className="font-light">
      
        <SunsetIcon />
        Sunset:
        <span className="font-medium ml-1">
          {formatToLocalTime(
            weather.weather.sunset,
            weather.weather.timeZone,
            "hh:mm a"
          )}
        </span>
      </p>
      <p className="font-light">|</p>
      <p className="font-light">
 
        <SunIcon />
        High:
        <span className="font-medium ml-1">{`${weather.weather.temp_max.toFixed()}°`}</span>
      </p>
      <p className="font-light">|</p>
      <p className="font-light">

        <SunIcon />
        Low:
        <span className="font-medium ml-1">{`${weather.weather.temp_min.toFixed()}°`}</span>
      </p>
    </div>
    </div>
  );
}
export default TemperatureAndDetails;
