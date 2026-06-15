import { Dto } from "@/app/common/dto";
import { OpenMeteo } from "@/app/api/open-meteo";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get("q")
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=10&language=en&format=json`;
    console.log(`Requesting ${url}`)
    const response = await fetch(url);
    const openMeteoBody: OpenMeteo.GeocodingResponse = await response.json();
    console.log(`Got Open-Meteo response body`)
    console.log(openMeteoBody)
    const openMeteoResults: Array<OpenMeteo.GeocodingResult> = openMeteoBody.results;
    const cityDtos = openMeteoResults.map(
        (openMeteoResult) => new Dto.City(
            openMeteoResult.id, 
            openMeteoResult.name, 
            openMeteoResult.admin2, 
            openMeteoResult.latitude, 
            openMeteoResult.longitude
        )
    );
    return NextResponse.json(cityDtos);
}