import React, { useState } from 'react'
 //.css';
import {
    Search as SearchIcon,
    LocationOn as LocationIcon,
  } from "@mui/icons-material";
import { positions } from '@mui/system';

function Inputs(Props:any) {
  const [city,setCity] = useState("");
  const handleSearchClick = () => {
    if(city!=="") Props.setQuery({q:city});
  }
  const handleLocationClick = () =>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position)=>{
        let lat = position.coords.latitude
        let lon = position.coords.longitude
        Props.setQuery({lat,lon});
      })
    }
  }
  const handleUnitsChange=(e:{currentTarget:{name:any;}})=>{
      const selectUnit = e.currentTarget.name;
      if(Props.units!==selectUnit) Props.setUnits(selectUnit);
  }

  return (
    <div className="flex flex-row justify-center my-6">
        <div className="flex flex-row w-3/4 items-center justify-center space-x-4">
            <input onChange={(e)=>setCity(e.currentTarget.value)} value = {city} type="text" placeholder='search for city...' className="text-xl font-light p-2 w-full shadow-xl focus:outline first-letter:capitalize placeholder:lowercase" />
            <SearchIcon 
            onClick = {handleSearchClick}
            fontSize="medium" 
            className="text-white cursor-pointer transition ease-out hover:scale-125"/>
            <LocationIcon 
            onClick = {handleLocationClick}
            fontSize="medium" 
            className="text-white cursor-pointer transition ease-out hover:scale-125"/>
        </div>
        <div className="flex flex-row w-1/4 items-center justify-center">
            <button onClick={handleUnitsChange} name='metric' className='text-xl font-light'>°C</button>
            <p className='text-xl text-white mx-1'>|</p>
            <button onClick={handleUnitsChange} name='imperial' className='text-xl font-light'>°F</button>
        </div>
    </div>
  );
}

export default Inputs