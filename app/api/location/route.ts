import { Domain } from "@/app/common/domain";
import { Dto } from "@/app/common/dto";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get("q")
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=10&language=en&format=json`;
    const remoteResponse = await fetch(url);
    const responseDto: Dto.GeocodingResponse = await remoteResponse.json();
    const resultDtos: Array<Dto.GeocodingResult> = responseDto.results;
    const cityDms = resultDtos.map(
        (resultDto) => new Domain.City(
            resultDto.id, resultDto.name, resultDto.admin2, resultDto.latitude, resultDto.longitude
        )
    );
    return NextResponse.json(cityDms);
}