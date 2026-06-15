import { Domain } from "@/app/common/domain"
import { Dto } from "@/app/common/dto"
import assert from "assert"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const lat = searchParams.get("lat")
    assert(lat)
    const latFloat = parseFloat(lat)
    const lon = searchParams.get("lon")
    assert(lon)
    const lonFloat = parseFloat(lon)
    return await retrieveForecast(latFloat, lonFloat)
}

async function retrieveForecast(lat: number, lon: number) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,weather_code&timezone=auto`
    const response = await fetch(url)
    const responseDto: Dto.WeatherResponse = await response.json()
    const resultDm = Domain.forecastOf(responseDto)
    return resultDm
}

