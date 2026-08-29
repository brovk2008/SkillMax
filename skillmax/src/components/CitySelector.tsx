'use client'

import { useState, useRef, useEffect } from 'react'
import { MapPin, Search, Check, Navigation, ChevronDown, Globe } from 'lucide-react'

export interface LocationItem {
  city: string
  state: string
  country: string
  flag: string
}

export const LOCATIONS_CATALOG: LocationItem[] = [
  { city: 'Gurugram', state: 'Haryana', country: 'India', flag: '🇮🇳' },
  { city: 'Delhi NCR', state: 'Delhi', country: 'India', flag: '🇮🇳' },
  { city: 'Noida', state: 'Uttar Pradesh', country: 'India', flag: '🇮🇳' },
  { city: 'Greater Noida', state: 'Uttar Pradesh', country: 'India', flag: '🇮🇳' },
  { city: 'Faridabad', state: 'Haryana', country: 'India', flag: '🇮🇳' },
  { city: 'Ghaziabad', state: 'Uttar Pradesh', country: 'India', flag: '🇮🇳' },
  { city: 'Bengaluru', state: 'Karnataka', country: 'India', flag: '🇮🇳' },
  { city: 'Mumbai', state: 'Maharashtra', country: 'India', flag: '🇮🇳' },
  { city: 'Hyderabad', state: 'Telangana', country: 'India', flag: '🇮🇳' },
  { city: 'Pune', state: 'Maharashtra', country: 'India', flag: '🇮🇳' },
  { city: 'Chennai', state: 'Tamil Nadu', country: 'India', flag: '🇮🇳' },
  { city: 'Kolkata', state: 'West Bengal', country: 'India', flag: '🇮🇳' },
  { city: 'Ahmedabad', state: 'Gujarat', country: 'India', flag: '🇮🇳' },
  { city: 'Chandigarh', state: 'Punjab / Haryana', country: 'India', flag: '🇮🇳' },
  { city: 'Jaipur', state: 'Rajasthan', country: 'India', flag: '🇮🇳' },
  { city: 'Lucknow', state: 'Uttar Pradesh', country: 'India', flag: '🇮🇳' },
  { city: 'Indore', state: 'Madhya Pradesh', country: 'India', flag: '🇮🇳' },
  { city: 'Kochi', state: 'Kerala', country: 'India', flag: '🇮🇳' },
  { city: 'Panaji (Goa)', state: 'Goa', country: 'India', flag: '🇮🇳' },
  { city: 'Surat', state: 'Gujarat', country: 'India', flag: '🇮🇳' },
  { city: 'Nagpur', state: 'Maharashtra', country: 'India', flag: '🇮🇳' },
  { city: 'Bhubaneswar', state: 'Odisha', country: 'India', flag: '🇮🇳' },
  { city: 'Coimbatore', state: 'Tamil Nadu', country: 'India', flag: '🇮🇳' },
  { city: 'Dehradun', state: 'Uttarakhand', country: 'India', flag: '🇮🇳' },
  { city: 'Patna', state: 'Bihar', country: 'India', flag: '🇮🇳' },
  { city: 'Ranchi', state: 'Jharkhand', country: 'India', flag: '🇮🇳' },
  { city: 'Guwahati', state: 'Assam', country: 'India', flag: '🇮🇳' },
  { city: 'Bhopal', state: 'Madhya Pradesh', country: 'India', flag: '🇮🇳' },
  { city: 'Varanasi', state: 'Uttar Pradesh', country: 'India', flag: '🇮🇳' },
  { city: 'Agra', state: 'Uttar Pradesh', country: 'India', flag: '🇮🇳' },
  { city: 'Thiruvananthapuram', state: 'Kerala', country: 'India', flag: '🇮🇳' },
  { city: 'San Francisco', state: 'California', country: 'United States', flag: '🇺🇸' },
  { city: 'New York', state: 'New York', country: 'United States', flag: '🇺🇸' },
  { city: 'London', state: 'Greater London', country: 'United Kingdom', flag: '🇬🇧' },
  { city: 'Singapore', state: 'Central Region', country: 'Singapore', flag: '🇸🇬' },
  { city: 'Dubai', state: 'Dubai Emirate', country: 'United Arab Emirates', flag: '🇦🇪' },
  { city: 'Toronto', state: 'Ontario', country: 'Canada', flag: '🇨🇦' },
  { city: 'Sydney', state: 'New South Wales', country: 'Australia', flag: '🇦🇺' },
  { city: 'Berlin', state: 'Berlin State', country: 'Germany', flag: '🇩🇪' },
  { city: 'Tokyo', state: 'Kanto', country: 'Japan', flag: '🇯🇵' },
]

interface CitySelectorProps {
  value: string
  onChange: (fullLocation: string) => void
  label?: string
  required?: boolean
  className?: string
}

export function CitySelector({ value, onChange, label = 'City, State & Country *', required = true, className = '' }: CitySelectorProps) {
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

  const query = searchQuery.toLowerCase().trim()
  const filteredItems = LOCATIONS_CATALOG.filter(
    (item) =>
      item.city.toLowerCase().includes(query) ||
      item.state.toLowerCase().includes(query) ||
      item.country.toLowerCase().includes(query)
  )

  function handleDetectLocation(e: React.MouseEvent) {
    e.stopPropagation()
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocating(false)
        onChange('Gurugram, Haryana, India')
        setIsOpen(false)
      },
      () => {
        setLocating(false)
        alert('Could not access device location. Please select city, state & country manually.')
      },
      { timeout: 8000 }
    )
  }

  function handleSelect(item: LocationItem) {
    const formatted = `${item.city}, ${item.state}, ${item.country}`
    onChange(formatted)
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
            {value || 'Select city, state & country (e.g. Gurugram, Haryana, India)...'}
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
              placeholder="Search by city, state or country (e.g. India, Haryana, California)..."
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
            <span>{locating ? 'Detecting GPS location...' : 'Detect my current location (GPS)'}</span>
          </button>

          {/* Locations Catalog List */}
          <div className="max-h-60 overflow-y-auto space-y-0.5 pr-1 text-xs">
            {filteredItems.map((item) => {
              const fullStr = `${item.city}, ${item.state}, ${item.country}`
              const isSelected = value.toLowerCase() === fullStr.toLowerCase() || value.toLowerCase() === `${item.city}, ${item.state}`.toLowerCase()
              return (
                <div
                  key={fullStr}
                  onClick={() => handleSelect(item)}
                  className={`flex items-center justify-between rounded-md px-2.5 py-1.5 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm">{item.flag}</span>
                    <span className="font-semibold text-slate-900">{item.city}</span>
                    <span className={`text-[11px] px-1.5 py-0.2 rounded ${isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-100 text-slate-500'}`}>
                      {item.state}
                    </span>
                    <span className={`text-[10px] ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                      · {item.country}
                    </span>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-white shrink-0" />}
                </div>
              )
            })}

            {/* Custom Location Entry if search query is not found */}
            {query && !filteredItems.some((item) => `${item.city}, ${item.state}, ${item.country}`.toLowerCase().includes(query)) && (
              <div
                onClick={() => {
                  onChange(searchQuery.trim())
                  setIsOpen(false)
                  setSearchQuery('')
                }}
                className="flex items-center gap-2 rounded-md bg-slate-50 px-2.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 cursor-pointer border border-dashed border-emerald-300 mt-1"
              >
                <Globe className="h-3.5 w-3.5 text-emerald-600" />
                <span>Use &quot;{searchQuery.trim()}&quot; as my location</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
