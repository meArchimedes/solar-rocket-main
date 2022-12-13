import * as DateTime from "luxon";
const API_KEY = "efbd4a4d7362b1270357df7cd6cd3a08";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

const getWeatherData = async (infoType: any, searchParams: any) => {
  const u = BASE_URL + "/" + infoType;
  const url = new URL(u);
  url.search = new URLSearchParams({
    ...searchParams,
    appid: API_KEY,
  }).toString();
  const res = await fetch(url.href);
  const data = await res.json();
  return data;

};
const formatCurrentWeather = (data: any) => {
  const {
    list,
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
  } = data;
  const { main: details, icon } = weather[0];
  return {
    list,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    dt,
    country,
    sunrise,
    sunset,
    details,
    icon,
    speed,
  };
};
const formatForecastWeather = async (data: any) => {
  let {  timeZone, list } = data;
  var daily = list
    .slice(0, 4)
    .map((d: { dt: any; main: { temp: any }; weather: { icon: any }[] }) => {
      return {
        title: formatToLocalTime(d.dt,  timeZone, "ccc"),
        temp: d.main.temp,
        icon: d.weather[0].icon,
      };
    });

  const hourly = list
    .slice(0, 4)
    .map((h: { dt: any; main: { temp: any }; weather: { icon: any }[] }) => {
      return {
        title: formatToLocalTime(h.dt,  timeZone, "hh:mm a"),
        temp: h.main.temp,
        icon: h.weather[0].icon,
      };
    });
  daily = [
    ...new Map(daily.map((item: any) => [item["title"], item])).values(),
  ];
  return {  timeZone, daily, hourly };
};
const getFormattedWeatherData = async (searchParams: any) => {
  const formattedCurrentWeather = await getWeatherData(
    "weather",
    searchParams
  ).then(formatCurrentWeather);

  const formattedForecastWeather = await getWeatherData(
    "forecast",
    searchParams
  ).then(formatForecastWeather);

  return { ...formattedCurrentWeather, ...formattedForecastWeather };
};

const formatToLocalTime = (
  secs: number,
  zone: any,
  format = "cccc,dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.DateTime.fromSeconds(Number(secs)).setZone(zone).toFormat(format);
const iconUrlFormCode = (code: any) =>
  `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;
export{formatToLocalTime, iconUrlFormCode, getWeatherData}
