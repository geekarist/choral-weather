import { Dto } from "./dto"

// TODO cpele: Rename to Domain
export namespace Model {

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

    // TODO cpele: Move DTO/model mapping to backend
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