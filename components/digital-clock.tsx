"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

export function DigitalClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const hours = time.getHours()
  const minutes = time.getMinutes()
  const ampm = hours >= 12 ? "PM" : "AM"
  const displayHours = hours % 12 || 12
  const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]

  return (
    <Card className="p-8 bg-white/60 backdrop-blur-sm border-blue-200">
      <div className="flex items-center justify-between">
        <div className="text-8xl font-bold text-blue-300 tracking-tight">
          {String(displayHours).padStart(2, "0")}.{String(minutes).padStart(2, "0")}
        </div>
        <div className="text-right">
          <div className="text-xl font-semibold text-blue-300">{ampm}</div>
          <div className="text-sm font-medium text-blue-300 mt-2">{days[time.getDay()]}</div>
        </div>
      </div>
    </Card>
  )
}
