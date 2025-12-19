"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Cloud, Sun, CloudRain, Wind, Droplets, Loader2 } from "lucide-react"

interface WeatherData {
    temp: number
    condition: string
    humidity: number
    windSpeed: number
    location: string
    }

    export function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Get user location and fetch weather
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
            try {
                const { latitude, longitude } = position.coords
                // Using Open-Meteo API (free, no API key required)
                const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`,
                )
                const data = await response.json()

                // Get location name using reverse geocoding
                const locationResponse = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`,
                )
                const locationData = await locationResponse.json()

                const weatherCode = data.current.weather_code
                let condition = "Clear"
                if (weatherCode >= 61 && weatherCode <= 67) condition = "Rainy"
                else if (weatherCode >= 51 && weatherCode <= 57) condition = "Drizzle"
                else if (weatherCode >= 71 && weatherCode <= 77) condition = "Snowy"
                else if (weatherCode >= 80 && weatherCode <= 82) condition = "Showers"
                else if (weatherCode >= 1 && weatherCode <= 3) condition = "Cloudy"

                setWeather({
                temp: Math.round(data.current.temperature_2m),
                condition,
                humidity: data.current.relative_humidity_2m,
                windSpeed: Math.round(data.current.wind_speed_10m),
                location: locationData.city || locationData.locality || "Your Location",
                })
                setLoading(false)
            } catch (err) {
                setError("Failed to fetch weather")
                setLoading(false)
            }
            },
            () => {
            setError("Location access denied")
            setLoading(false)
            },
        )
        } else {
        setError("Geolocation not supported")
        setLoading(false)
        }
    }, [])

    const getWeatherIcon = (condition: string) => {
        switch (condition) {
        case "Rainy":
        case "Showers":
        case "Drizzle":
            return <CloudRain className="h-12 w-12 text-blue-300" />
        case "Cloudy":
            return <Cloud className="h-12 w-12 text-blue-300" />
        default:
            return <Sun className="h-12 w-12 text-yellow-300" />
        }
    }

    if (loading) {
        return (
        <Card className="p-6 bg-gradient-to-br from-blue-200 to-blue-100 border-1 border-blue-200">
            <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        </Card>
        )
    }

    if (error || !weather) {
        return (
        <Card className="p-6 bg-gradient-to-br from-blue-200 to-blue-100 border-1 border-blue-200">
            <div className="text-center text-muted-foreground">
            <Cloud className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{error || "Weather unavailable"}</p>
            </div>
        </Card>
        )
    }

    return (
        <Card className="p-6 bg-gradient-to-br from-blue-200 to-blue-100 border-1 border-blue-200">
        <div className="flex items-center justify-between">
            <div className="flex-1">
            <div className="text-lg font-semibold text-blue-900 mb-1">{weather.location}</div>
            <div className="text-5xl font-regular text-blue-900 mb-1">{weather.temp}°C</div>
            <div className="text-lg text-blue-900">{weather.condition}</div>
            </div>
            <div className="flex flex-col items-center">{getWeatherIcon(weather.condition)}</div>
        </div>

        <div className="mt-4 flex gap-4 pt-4 border-t border-blue-300">
            <div className="flex items-center gap-2 flex-1">
            <Droplets className="h-5 w-5 text-blue-900" />
            <div>
                <div className="text-xs text-foreground">Humidity</div>
                <div className="font-semibold">{weather.humidity}%</div>
            </div>
            </div>
            <div className="flex items-center gap-2 flex-1">
            <Wind className="h-5 w-5 text-blue-900" />
            <div>
                <div className="text-xs text-foreground">Wind</div>
                <div className="font-semibold">{weather.windSpeed} km/h</div>
            </div>
            </div>
        </div>
        </Card>
    )
}