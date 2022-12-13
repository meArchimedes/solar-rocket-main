import React from 'react'
import { formatToLocalTime } from '../services/WeatherService'
 

function TimeAndLocation(weather:any) {
  return (
    <div>
        <div className='flex items-center justify-center my-6'>
          <p className='text-white text-xl font-extralight'>
            {formatToLocalTime(weather.weather.dt, weather.weather.timeZone)}
            </p>

        </div>
        <div className='flex items-center justify-center my-3'></div>
        <p className='text-white text-3xl font-medium'>
            {`${weather.weather.name}, ${weather.weather.country}`}
        </p>
    </div>
  )
}

export default TimeAndLocation