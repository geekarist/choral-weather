'use client'

import assert from "assert";
import { useState } from "react";
import { Domain } from "./common/domain";
import { Dto } from "./common/dto";

export default function Home() {

  const [query, setQuery] = useState("")
  const [cityDms, setCityDms] = useState(new Array<Domain.City>())
  const [forecastDm, setForecastDm] = useState<Domain.Forecast>()

  async function retrieveCities(query: string): Promise<Domain.City[]> {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=10&language=en&format=json`;
    const response = await fetch(url);
    const responseDto: Dto.GeocodingResponse = await response.json();
    const resultDtos: Array<Dto.GeocodingResult> = responseDto.results;
    const cityDms = resultDtos.map(
      (resultDto) => new Domain.City(
        resultDto.id, resultDto.name, resultDto.admin2, resultDto.latitude, resultDto.longitude
      )
    );
    return cityDms;
  }

  async function retrieveForecast(selectedCityModel: Domain.City): Promise<Domain.Forecast> {
    const lat = selectedCityModel.latitude
    const lon = selectedCityModel.longitude
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,weather_code&timezone=auto`
    const response = await fetch(url)
    const responseDto: Dto.WeatherResponse = await response.json()
    const resultDm = Domain.forecastOf(responseDto)
    return resultDm
  }

  async function onCitySearched() {
    const cityDms = await retrieveCities(query);
    setCityDms(cityDms)
  }

  async function onCitySelected(selectedCityId: number) {
    const selectedCityDm = cityDms.find((model) => model.id == selectedCityId)
    assert(selectedCityDm)
    const resultDm = await retrieveForecast(selectedCityDm)
    setForecastDm(resultDm)
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
                cityDms.map((model) =>
                  <option key={model.id} value={model.id}>{model.name} ({model.dept})</option>)
              }
            </select>
          </div>
          <div className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            <ul>
              {
                forecastDm?.daily.map((predictionModel) => {
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