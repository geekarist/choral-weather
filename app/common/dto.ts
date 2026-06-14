export namespace Dto {
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