import React from 'react'
 //.css';

function TopButtons(Props:any) {
    const cities = [
        {
            id: 1,
            title: "London"
        },
        {
            id: 2,
            title: "Sydney"
        }, 
        {
            id: 3,
            title: "Tokyo"
        },
        {
            id: 4,
            title: "Toronto"
        },
        {
            id: 5,
            title: "Paris"
        },
    ];
  return (
    <div className='flex items-center justify-around my-6'>
        {cities.map((city) => (
            <button  onClick={()=>Props.setQuery({q:city.title})} key={city.id} className="text-white text-lg front-medium">{city.title}</button>
        ))}
    </div>
  )
}

export default TopButtons