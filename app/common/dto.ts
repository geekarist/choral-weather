import { OpenMeteo } from "../api/open-meteo"

export namespace Dto {

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
    date: string
    sunrise: string
    sunset: string
    minTemperature: QualifiedValue
    maxTemperature: QualifiedValue
    precipitationSum: QualifiedValue
    precipitationProbability: QualifiedValue

    constructor(
      key: string,
      date: string,
      sunrise: string,
      sunset: string,
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

  export function forecastOf(openMeteoResponse: OpenMeteo.Forecast): Forecast {
    let predictionDtos = Array<Prediction>(openMeteoResponse.daily.time.length)
    for (let i = 0; i < openMeteoResponse.daily.time.length; i++) {
      const predictionTime = openMeteoResponse.daily.time[i];
      predictionDtos[i] = new Prediction(
        `prediction-${predictionTime.toString()}`,
        predictionTime,
        openMeteoResponse.daily.sunrise[i],
        openMeteoResponse.daily.sunset[i],
        {
          value: openMeteoResponse.daily.temperature_2m_min[i],
          unit: openMeteoResponse.daily_units.temperature_2m_min
        },
        {
          value: openMeteoResponse.daily.temperature_2m_max[i],
          unit: openMeteoResponse.daily_units.temperature_2m_max
        },
        {
          value: openMeteoResponse.daily.precipitation_sum[i],
          unit: openMeteoResponse.daily_units.precipitation_sum
        },
        {
          value: openMeteoResponse.daily.precipitation_probability_max[i],
          unit: openMeteoResponse.daily_units.precipitation_probability_max
        }
      )
    }
    return new Forecast(predictionDtos)
  }
}

