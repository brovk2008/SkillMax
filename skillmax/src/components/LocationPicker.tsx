'use client'

import { useState, useEffect } from 'react'
import { MapPin, Navigation, CheckCircle2 } from 'lucide-react'

export function LocationPicker() {
  const [locationName, setLocationName] = useState('Delhi NCR')
  const [locating, setLocating] = useState(false)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)

  function handleDetectLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setCoords({ lat: latitude, lng: longitude })
        setLocationName('Near Me (GPS Active)')
        setLocating(false)
      },
      (err) => {
        console.error('Location error:', err)
        setLocating(false)
        alert('Could not access device location. Using default city (Delhi NCR).')
      },
      { timeout: 10000 }
    )
  }

  return (
    <button
      onClick={handleDetectLocation}
      disabled={locating}
      className="hidden md:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
      title="Click to detect current device GPS location"
    >
      {locating ? (
        <Navigation className="h-3.5 w-3.5 text-emerald-600 animate-spin" />
      ) : coords ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
      ) : (
        <MapPin className="h-3.5 w-3.5 text-emerald-600" />
      )}
      <span>{locating ? 'Detecting...' : locationName}</span>
      <span className="text-slate-400 text-[10px]">▾</span>
    </button>
  )
}
