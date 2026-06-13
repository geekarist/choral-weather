'use client'

import assert from "assert";
import { useState } from "react";

namespace Model {
  export class City {
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

  export type QualifiedValue = {
    value: number
    unit: string
  }

  export class Prediction {
    key: string
    date: Date
    sunrise: Date
    sunset: Date
    minTemperature: QualifiedValue
    maxTemperature: QualifiedValue
    precipitationSum: QualifiedValue
    precipitationProbability: QualifiedValue

    constructor(
      key: string,
      date: Date,
      sunrise: Date,
      sunset: Date,
      minTemperature: QualifiedValue,
      maxTemperature: QualifiedValue,
      precipitationSum: QualifiedValue,
      precipitationProbability: QualifiedValue,
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

  export class Forecast {
    daily: Prediction[]

    constructor(daily: Prediction[]) {
      this.daily = daily
    }
  }

  export function forecastOf(responseDto: Dto.WeatherResponse): Model.Forecast {
    let predictionUims = Array<Model.Prediction>(responseDto.daily.time.length)
    for (let i = 0; i < responseDto.daily.time.length; i++) {
      const predictionTime = responseDto.daily.time[i];
      predictionUims[i] = new Model.Prediction(
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
    return new Model.Forecast(predictionUims)
  }
}

namespace Dto {
  export type GeocodingResult = {
    id: number
    name: string
    admin1: string
    admin2: string
    admin3: string
    admin4: string
    latitude: number
    longitude: number
  }

  export type GeocodingResponse = {
    results: Array<GeocodingResult>
  }

  export type WeatherResponse = {
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
}

export default function Home() {

  const [query, setQuery] = useState("")
  const [cityModels, setCityModels] = useState(new Array<Model.City>())
  const [forecastModel, setForecastModel] = useState<Model.Forecast>()

  async function onCitySearched() {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=10&language=en&format=json`
    const response = await fetch(url);
    const responseDto: Dto.GeocodingResponse = await response.json()
    const resultDtos: Array<Dto.GeocodingResult> = responseDto.results
    const cityModels = resultDtos.map(
      (resultDto) => new Model.City(
        resultDto.id, resultDto.name, resultDto.admin2, resultDto.latitude, resultDto.longitude
      )
    )
    setCityModels(cityModels)
  }

  async function onCitySelected(selectedCityId: number) {
    const selectedCityModel = cityModels.find((model) => model.id == selectedCityId)
    assert(selectedCityModel)
    const lat = selectedCityModel.latitude
    const lon = selectedCityModel.longitude
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,weather_code&timezone=auto`
    const response = await fetch(url)
    const responseDto: Dto.WeatherResponse = await response.json()
    const resultModel = Model.forecastOf(responseDto)
    setForecastModel(resultModel)
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
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => { onCitySearched() }}>Search
            </button>
          </p>
          <div className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            <select onChange={(event) => onCitySelected(parseInt(event.target.value))}>
              <option value={-1}>Select a result</option>
              {
                cityModels.map((model) =>
                  <option key={model.id} value={model.id}>{model.name} ({model.dept})</option>)
              }
            </select>
          </div>
          <div className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            <ul>
              {
                forecastModel?.daily.map((predictionModel) => {
                  return <li key={predictionModel.key}>
                    {
                      Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(predictionModel.date)
                    }: {
                      predictionModel.minTemperature.value
                    } {
                      predictionModel.minTemperature.unit
                    } / {
                      predictionModel.maxTemperature.value
                    } {
                      predictionModel.maxTemperature.unit
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