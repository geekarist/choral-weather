## Choral Weather

### Features

#### Implemented

TBD

#### Planned

## Features

- Let users search for weather by city, ZIP code.
- Let user search for current location.
- Request permission before using the user's current location.
- Show the current temperature for the selected location.
- Show the current weather condition, such as sunny, cloudy, rain, snow, or storm.
- Show high and low temperatures for the day.
- Show "feels like" temperature.
- Show humidity, wind speed, and precipitation chance.
- Show a multi-day weather forecast.
- Show an hourly forecast for the current day.
- Display weather icons that match each forecast condition.
- Let users switch between Fahrenheit and Celsius.
- Remember the user's last searched or selected location.
- Show a loading state while weather data is being fetched.
- Show an error message if weather data cannot be loaded.
- Handle invalid or unknown location searches.
- Refresh weather data when the user changes location.
- Display the date and time of the latest weather update.
- Work on both desktop and mobile screen sizes.
- Remain usable if location permission is denied.
- Protect any weather API key from being exposed in client-side code when required by the API provider.

### Develop

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
