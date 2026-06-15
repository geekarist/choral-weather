import { Dto } from "./dto"

export namespace Domain {

    export class City extends Dto.City { }

    export type QualifiedValue = Dto.QualifiedValue 

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

    export function citiesOf(cityDtos: Dto.City[]): City[] {
        return cityDtos.map((cityDto) => new City(
            cityDto.id,
            cityDto.name,
            cityDto.dept,
            cityDto.latitude,
            cityDto.longitude
        ))
    }

    export function forecastOf(forecastDto: Dto.Forecast) {
        return new Forecast(
            forecastDto.daily.map((predictionDto) => predictionOf(predictionDto))
        )
    }

    export function predictionOf(predictionDto: Dto.Prediction) {
        return new Prediction(
            predictionDto.key,
            new Date(predictionDto.date),
            new Date(predictionDto.sunrise),
            new Date(predictionDto.sunset),
            predictionDto.minTemperature,
            predictionDto.maxTemperature,
            predictionDto.precipitationSum,
            predictionDto.precipitationProbability
        )
    }
}