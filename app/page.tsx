'use client'

import assert from "assert";
import Image from "next/image";
import { useEffect, useState } from "react";

// Geocoding URL:
// Doc: https://open-meteo.com/en/docs?latitude=48.3357&longitude=2.7442&hourly=&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,weather_code&timezone=auto
// Call: https://geocoding-api.open-meteo.com/v1/search?name=Montigny-sur-Loing&count=10&language=en&format=json

// Weather API:
// Doc: https://open-meteo.com/en/docs/geocoding-api?name=Montigny-sur-Loing#api_response
// Call: https://api.open-meteo.com/v1/forecast?latitude=48.33575&longitude=2.74423&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,weather_code&timezone=auto

class GeocodingResultUim {
  id: number
  name: string
  dept: string
  latitude: number
  longitude: number

  constructor(id: number, name: string, dept: string, latitude: number, longitude: number) {
    this.id = id
    this.name = name
    this.dept = dept
    this.latitude = latitude
    this.longitude = longitude
  }
}

type GeocodingResultDto = {
  id: number
  name: string
  admin1: string
  admin2: string
  admin3: string
  admin4: string
  latitude: number
  longitude: number
}

type GeocodingResponseDto = {
  results: Array<GeocodingResultDto>
}

type WeatherResponseDto = {
  daily_units: {
    time: string
    temperature_2m_max: string
    temperature_2m_min: string
    sunrise: string
    sunset: string
    precipitation_sum: string
    precipitation_probability_max: string
    weather_code: string
  }
  daily: {
    time: string[]
    temperature_2m_min: number[]
    temperature_2m_max: number[]
    sunrise: string[]
    sunset: string[]
    precipitation_sum: number[]
    precipitation_probability_max: number[]
    weather_code: number[]
  }
}

type QualifiedValueUim = {
  value: number
  unit: string
}

class PredictionUim {
  key: string
  date: Date
  sunrise: Date
  sunset: Date
  minTemperature: QualifiedValueUim
  maxTemperature: QualifiedValueUim
  precipitationSum: QualifiedValueUim
  precipitationProbability: QualifiedValueUim

  constructor(
    key: string,
    date: Date,
    sunrise: Date,
    sunset: Date,
    minTemperature: QualifiedValueUim,
    maxTemperature: QualifiedValueUim,
    precipitationSum: QualifiedValueUim,
    precipitationProbability: QualifiedValueUim,
  ) {
    this.key = key
    this.date = date
    this.sunrise = sunrise
    this.sunset = sunset
    this.minTemperature = minTemperature
    this.maxTemperature = maxTemperature
    this.precipitationSum = precipitationSum
    this.precipitationProbability = precipitationProbability
  }
}

class WeatherForecastUim {
  dailyPredictions: PredictionUim[]

  constructor(dailyPredictions: PredictionUim[]) {
    this.dailyPredictions = dailyPredictions
  }
}

export default function Home() {

  const [query, setQuery] = useState("")
  const [geocodingResultUims, setGeocodingResultUims] = useState(new Array<GeocodingResultUim>())
  const [weatherForecastUim, setWeatherForecastUim] = useState<WeatherForecastUim>()

  async function geocode() {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=10&language=en&format=json`;
    const response = await fetch(url);
    const responseDto: GeocodingResponseDto = await response.json()
    const resultDtos: Array<GeocodingResultDto> = responseDto.results
    const resultUims = resultDtos.map(
      (resultDto) => new GeocodingResultUim(
        resultDto.id, resultDto.name, resultDto.admin2, resultDto.latitude, resultDto.longitude
      )
    )
    setGeocodingResultUims(resultUims)
  }

  async function onCitySelected(selectedCityId: number) {
    const selectedCityUim = geocodingResultUims.find((uim) => uim.id == selectedCityId)
    assert(selectedCityUim)
    const lat = selectedCityUim.latitude
    const lon = selectedCityUim.longitude
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,weather_code&timezone=auto`
    const response = await fetch(url)
    const responseDto: WeatherResponseDto = await response.json()
    const resultUim = buildWeatherUim(responseDto)
    setWeatherForecastUim(resultUim)
  }

  function buildWeatherUim(responseDto: WeatherResponseDto): WeatherForecastUim {
    let predictionUims = Array<PredictionUim>(responseDto.daily.time.length)
    for (let i = 0; i < responseDto.daily.time.length; i++) {
      const predictionTime = responseDto.daily.time[i];
      predictionUims[i] = new PredictionUim(
        `prediction-${predictionTime.toString()}`,
        new Date(predictionTime),
        new Date(responseDto.daily.sunrise[i]),
        new Date(responseDto.daily.sunset[i]),
        {
          value: responseDto.daily.temperature_2m_min[i],
          unit: responseDto.daily_units.temperature_2m_min
        },
        {
          value: responseDto.daily.temperature_2m_max[i],
          unit: responseDto.daily_units.temperature_2m_max
        },
        {
          value: responseDto.daily.precipitation_sum[i],
          unit: responseDto.daily_units.precipitation_sum
        },
        {
          value: responseDto.daily.precipitation_probability_max[i],
          unit: responseDto.daily_units.precipitation_probability_max
        }
      )
    }
    return new WeatherForecastUim(predictionUims)
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
          <div className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            <select onChange={(event) => onCitySelected(parseInt(event.target.value))}>
              <option value={-1}>Select a result</option>
              {
                geocodingResultUims.map((uim) =>
                  <option key={uim.id} value={uim.id}>{uim.name} ({uim.dept})</option>)
              }
            </select>
          </div>
          <div className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            <ul>
              {
                weatherForecastUim?.dailyPredictions.map((predictionUim) => {
                  return <li key={predictionUim.key}>
                    {
                      Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(predictionUim.date)
                    }: {
                      predictionUim.minTemperature.value
                    } {
                      predictionUim.minTemperature.unit
                    } / {
                      predictionUim.maxTemperature.value
                    } {
                      predictionUim.maxTemperature.unit
                    }
                  </li>
                })
              }
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}



