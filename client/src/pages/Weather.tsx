import { Container } from "@mui/material";
import { AppLayout } from "../layouts/AppLayout";
import TopButtons from "../components/TopButtons";
import Inputs from "../components/Inputs";
import TimeAndLocation from "../components/TimeAndLocation";
import TemperatureAndDetails from "../components/TemperatureAndDetails";
import Forecast from "../components/Forecast";
import { useEffect, useState } from "react";
import WeatherService from "../services/WeatherService";
//@ts-ignore

const Weather = (): JSX.Element => {
  const [query, setQuery] = useState({ q: "albuquerque" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState();

  useEffect(() => {
    const fetchWeather = async () => {
      const message = query.q ? query.q : "current location.";
      await WeatherService({ ...query, units }).then((data: any) => {
        return setWeather(data);
      });
    };
    fetchWeather();
  }, [query, units]);

  return (
    <AppLayout title="Weather">
      <Container maxWidth="lg">
        <div
          id="top"
          className="mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br from-cyan-700 to-blue-700 h-fit shadow-xl shadow-gray-400"
        >
          <TopButtons setQuery={setQuery} />
          <Inputs setQuery={setQuery} units={units} setUnits={setUnits} />
          {weather && (
            <div>
              <TimeAndLocation weather = {weather}/>
              <TemperatureAndDetails weather = {weather} />
              <Forecast weather = {weather} title={"Hourly forecast"} />
              <Forecast weather = {weather} title={"Daily forecast"} />
            </div>
          )}
        </div>
      </Container>
    </AppLayout>
  );
};

export { Weather };
