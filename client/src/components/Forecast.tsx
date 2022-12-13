import React from "react";
import { WeatherList } from "../graphql/schema";
import { iconUrlFormCode } from "../services/WeatherService";

function Forecast(Props:{title:String, weather:{daily:WeatherList[];hourly:WeatherList[];},}) {
  var list: WeatherList[];
  if(Props.title==="daily"){
    list = Props.weather.daily;
  }
  else{
    list = Props.weather.hourly;

  }
  return (
    <div>
      <div className="flex items-center justify-start my-6">
        <p className="text-white font-medium uppercase">{`${Props.title}`}</p>
      </div>
      <hr className="my-2" />
      <div className="flex flex-row items-center justify-between text-white">
        {Array.from(list).map((item)=>(
          <div className="flex flex-col items-center justify-center">
          <p className="font-light text-sm">{item.title}</p>
          <img
            src={iconUrlFormCode(item.icon)}
            className="w-12 my-1"
            alt=""
          />
          <p className="font-medium">{`${item.temp.toFixed()}°`}</p>
       </div>

        ))}
        
      </div>
    </div>
  );
}

export default Forecast;