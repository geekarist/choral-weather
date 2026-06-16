'use client'

import assert from "assert";
import { useState } from "react";
import { Domain } from "./common/domain";
import { Dto } from "./common/dto";

export default function Home() {

  const [query, setQuery] = useState("")
  const [cityDms, setCityDms] = useState(new Array<Domain.City>())
  const [forecastDm, setForecastDm] = useState<Domain.Forecast>()
  const [selectedCity, setSelectedCity] = useState<Domain.City>()

  async function retrieveCities(query: string): Promise<Domain.City[]> {
    const citiesResponse = await fetch(`/api/cities?q=${query}`)
    const cityDtos: Dto.City[] = await citiesResponse.json()
    return Domain.citiesOf(cityDtos)
  }

  async function retrieveForecast(selectedCityDm: Domain.City): Promise<Domain.Forecast> {
    const lat = selectedCityDm.latitude
    const lon = selectedCityDm.longitude
    const forecastResponse = await fetch(`/api/forecast?lat=${lat}&lon=${lon}`)
    const forecastDto = await forecastResponse.json()
    return Domain.forecastOf(forecastDto)
  }

  async function onCitySearched() {
    const cityDms = await retrieveCities(query);
    setCityDms(cityDms)
  }

  async function onCitySelected(selectedCityId: number) {
    const selectedCityDm = cityDms.find((model) => model.id == selectedCityId)
    assert(selectedCityDm)
    setSelectedCity(selectedCityDm)
    const resultDm = await retrieveForecast(selectedCityDm)
    setForecastDm(resultDm)
  }

  function FavoriteButton({ visible }: { visible: boolean }) {
    if (visible) {
      return <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add favorite
      </button>
    } else {
      // No button
    }
  }

  function Forecast() {
    return forecastDm != undefined ? (
      <ul className="mt-6">
        {
          forecastDm?.daily.map((predictionModel) => {
            return <li key={predictionModel.key}>
              {
                Intl
                  .DateTimeFormat("en-US", { dateStyle: "full" })
                  .format(predictionModel.date)
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
    ) : (
      undefined
    )
  }

  function CitySelector() {
    return (cityDms.length > 0) ? (
      <div className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        <select className="w-md" onChange={(event) => onCitySelected(parseInt(event.target.value))}>
          <option value={-1}>Select a result</option>
          {
            cityDms.map((model) =>
              <option key={model.id} value={model.id}>{model.name} ({model.dept})</option>)
          }
        </select>
      </div>
    ) : (
      undefined
    )
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
              <div>
                Find a city
              </div>
              <div>
                <input type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={query}
                  onChange={(event) => { setQuery(event.target.value) }} />
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                onClick={() => { onCitySearched() }}>Search
              </button>
            </div>

            <CitySelector />
            <FavoriteButton visible={selectedCity !== undefined} />
            <Forecast />
          </div>
        </div>
      </main >
    </div >
  )
}