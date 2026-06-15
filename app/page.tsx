'use client'

import assert from "assert";
import { useState } from "react";
import { Domain } from "./common/domain";

export default function Home() {

  const [query, setQuery] = useState("")
  const [cityDms, setCityDms] = useState(new Array<Domain.City>())
  const [forecastDm, setForecastDm] = useState<Domain.Forecast>()

  async function retrieveCities(query: string): Promise<Domain.City[]> {
    const locationResponse = await fetch(`/api/location?q=${query}`)
    const locationDm = await locationResponse.json()
    return locationDm
  }

  async function retrieveForecast(selectedCityDm: Domain.City): Promise<Domain.Forecast> {
    const lat = selectedCityDm.latitude
    const lon = selectedCityDm.longitude
    const forecastResponse = await fetch(`/api/forecast?lat=${lat}&lon=${lon}`)
    const locationDm = await forecastResponse.json()
    return locationDm
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