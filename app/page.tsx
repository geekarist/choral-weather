'use client'

import Image from "next/image";
import { useEffect, useState } from "react";

// Geocoding URL:
// Doc: https://open-meteo.com/en/docs?latitude=48.3357&longitude=2.7442&hourly=&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,weather_code&timezone=auto
// Call: https://geocoding-api.open-meteo.com/v1/search?name=Montigny-sur-Loing&count=10&language=en&format=json

// Weather API:
// Doc: https://open-meteo.com/en/docs/geocoding-api?name=Montigny-sur-Loing#api_response
// Call: https://api.open-meteo.com/v1/forecast?latitude=48.33575&longitude=2.74423&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,weather_code&timezone=auto

export default function Home() {

  const [query, setQuery] = useState("")

  async function geocode() {
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=10&language=en&format=json`;
    const geocodingResult = await fetch(geocodingUrl);
    const geocodingResultJson = await geocodingResult.json()
    console.log(geocodingResultJson)
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Choral Weather
          </h1>
          <div className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            <div>
              Find a city
            </div>
            <div>
              <input type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={query}
                onChange={(event) => { setQuery(event.target.value) }} />
            </div>
          </div>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => { geocode() }}>Search</button>
          </p>
        </div>
      </main>
    </div>
  );
}
