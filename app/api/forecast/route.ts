import { Dto } from "@/app/common/dto"
import { OpenMeteo } from "@/app/api/open-meteo"
import assert from "assert"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const lat = searchParams.get("lat")
    assert(lat)
    const latFloat = parseFloat(lat)
    const lon = searchParams.get("lon")
    assert(lon)
    const lonFloat = parseFloat(lon)
    const forecastDto = await retrieveForecast(latFloat, lonFloat)
    return NextResponse.json(forecastDto)
}

async function retrieveForecast(lat: number, lon: number) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,weather_code&timezone=auto`
    console.log(`Requesting ${url}`)
    const openMeteoResponse = await fetch(url)
    const openMeteoForecast: OpenMeteo.Forecast = await openMeteoResponse.json()
    console.log("Got OM forecast")
    console.log(openMeteoForecast)
    return Dto.forecastOf(openMeteoForecast)
}

