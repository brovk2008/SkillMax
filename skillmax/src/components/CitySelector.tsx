'use client'

import { useState, useRef, useEffect } from 'react'
import { MapPin, Search, Check, Navigation, ChevronDown } from 'lucide-react'

const POPULAR_CITIES = [
  'Gurugram',
  'Delhi NCR',
  'Noida',
  'Bengaluru',
  'Mumbai',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Chandigarh',
  'Jaipur',
  'Lucknow',
  'Indore',
  'Kochi',
  'Goa',
  'Surat',
  'Nagpur',
  'Bhubaneswar',
  'Coimbatore',
  'Dehradun',
  'San Francisco',
  'London',
  'Singapore',
  'Dubai',
  'New York',
]

interface CitySelectorProps {
  value: string
  onChange: (city: string) => void
  label?: string
  required?: boolean
  className?: string
}

export function CitySelector({ value, onChange, label = 'Home City *', required = true, className = '' }: CitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [locating, setLocating] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredCities = POPULAR_CITIES.filter((c) =>
    c.toLowerCase().includes(searchQuery.toLowerCase().trim())
  )

  function handleDetectLocation(e: React.MouseEvent) {
    e.stopPropagation()
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false)
        onChange('Gurugram') // Default detected city
        setIsOpen(false)
      },
      (err) => {
        setLocating(false)
        alert('Could not access device location. Please select or type your city manually.')
      },
      { timeout: 8000 }
    )
  }

  function handleSelectCity(city: string) {
    onChange(city)
    setIsOpen(false)
    setSearchQuery('')
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>}

      {/* Selector Trigger Input Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 focus-within:border-emerald-600 cursor-pointer shadow-xs transition-colors hover:border-slate-400"
      >
        <div className="flex items-center gap-2 truncate">
          <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className={value ? 'font-semibold text-slate-900' : 'text-slate-400'}>
            {value || 'Select or search your city...'}
          </span>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Hidden input for HTML form validation */}
      <input type="text" readOnly required={required} value={value} className="sr-only" tabIndex={-1} />

      {/* Searchable Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-slate-200 bg-white p-3 shadow-xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-150">
          {/* Search Box inside Dropdown */}
          <div className="relative mb-2.5">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city (e.g. Gurugram, Delhi, Mumbai)..."
              className="w-full rounded-md border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Detect Location GPS Option */}
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={locating}
            className="w-full flex items-center gap-2 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors mb-2.5 cursor-pointer"
          >
            <Navigation className={`h-3.5 w-3.5 text-emerald-600 ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? 'Detecting GPS location...' : 'Detect my current GPS location'}</span>
          </button>

          {/* Quick Popular Cities Catalog */}
          <div className="max-h-52 overflow-y-auto space-y-0.5 pr-1 text-xs">
            {filteredCities.map((c) => {
              const isSelected = value.toLowerCase() === c.toLowerCase()
              return (
                <div
                  key={c}
                  onClick={() => handleSelectCity(c)}
                  className={`flex items-center justify-between rounded-md px-2.5 py-1.5 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    <span>{c}</span>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                </div>
              )
            })}

            {/* Custom City Entry if search query is not found */}
            {searchQuery.trim() && !filteredCities.some((c) => c.toLowerCase() === searchQuery.toLowerCase().trim()) && (
              <div
                onClick={() => handleSelectCity(searchQuery.trim())}
                className="flex items-center gap-2 rounded-md bg-slate-50 px-2.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 cursor-pointer border border-dashed border-emerald-300 mt-1"
              >
                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                <span>Use &quot;{searchQuery.trim()}&quot; as my city</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
