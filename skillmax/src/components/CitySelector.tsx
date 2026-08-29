'use client'

import { useState, useRef, useEffect } from 'react'
import { MapPin, Search, Check, Navigation, ChevronDown, Building2 } from 'lucide-react'

export interface CityStateItem {
  city: string
  state: string
}

export const CITIES_WITH_STATES: CityStateItem[] = [
  { city: 'Gurugram', state: 'Haryana' },
  { city: 'Delhi NCR', state: 'Delhi NCR' },
  { city: 'Noida', state: 'Uttar Pradesh' },
  { city: 'Greater Noida', state: 'Uttar Pradesh' },
  { city: 'Faridabad', state: 'Haryana' },
  { city: 'Ghaziabad', state: 'Uttar Pradesh' },
  { city: 'Bengaluru', state: 'Karnataka' },
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Chandigarh', state: 'Punjab / Haryana' },
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Lucknow', state: 'Uttar Pradesh' },
  { city: 'Indore', state: 'Madhya Pradesh' },
  { city: 'Kochi', state: 'Kerala' },
  { city: 'Panaji (Goa)', state: 'Goa' },
  { city: 'Surat', state: 'Gujarat' },
  { city: 'Nagpur', state: 'Maharashtra' },
  { city: 'Bhubaneswar', state: 'Odisha' },
  { city: 'Coimbatore', state: 'Tamil Nadu' },
  { city: 'Dehradun', state: 'Uttarakhand' },
  { city: 'Patna', state: 'Bihar' },
  { city: 'Ranchi', state: 'Jharkhand' },
  { city: 'Guwahati', state: 'Assam' },
  { city: 'Bhopal', state: 'Madhya Pradesh' },
  { city: 'Varanasi', state: 'Uttar Pradesh' },
  { city: 'Agra', state: 'Uttar Pradesh' },
  { city: 'Thiruvananthapuram', state: 'Kerala' },
  { city: 'San Francisco', state: 'California, USA' },
  { city: 'London', state: 'Greater London, UK' },
  { city: 'Singapore', state: 'Central Region, SG' },
  { city: 'Dubai', state: 'Dubai Emirate, UAE' },
  { city: 'New York', state: 'New York, USA' },
]

interface CitySelectorProps {
  value: string
  onChange: (cityWithState: string) => void
  label?: string
  required?: boolean
  className?: string
}

export function CitySelector({ value, onChange, label = 'Home City & State *', required = true, className = '' }: CitySelectorProps) {
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
  const filteredItems = CITIES_WITH_STATES.filter(
    (item) => item.city.toLowerCase().includes(query) || item.state.toLowerCase().includes(query)
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
        onChange('Gurugram, Haryana')
        setIsOpen(false)
      },
      () => {
        setLocating(false)
        alert('Could not access device location. Please select city & state manually.')
      },
      { timeout: 8000 }
    )
  }

  function handleSelect(item: CityStateItem) {
    const formatted = `${item.city}, ${item.state}`
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
            {value || 'Select city & state (e.g. Gurugram, Haryana)...'}
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
              placeholder="Search by city or state (e.g. Haryana, Mumbai, Karnataka)..."
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

          {/* Cities & States List */}
          <div className="max-h-56 overflow-y-auto space-y-0.5 pr-1 text-xs">
            {filteredItems.map((item) => {
              const fullStr = `${item.city}, ${item.state}`
              const isSelected = value.toLowerCase() === fullStr.toLowerCase() || value.toLowerCase() === item.city.toLowerCase()
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
                  <div className="flex items-center gap-2">
                    <MapPin className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    <span className="font-semibold">{item.city}</span>
                    <span className={`text-[11px] px-1.5 py-0.2 rounded ${isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-100 text-slate-500'}`}>
                      {item.state}
                    </span>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                </div>
              )
            })}

            {/* Custom City & State Entry if search query is not found */}
            {query && !filteredItems.some((item) => `${item.city}, ${item.state}`.toLowerCase().includes(query)) && (
              <div
                onClick={() => {
                  onChange(searchQuery.trim())
                  setIsOpen(false)
                  setSearchQuery('')
                }}
                className="flex items-center gap-2 rounded-md bg-slate-50 px-2.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 cursor-pointer border border-dashed border-emerald-300 mt-1"
              >
                <Building2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Use &quot;{searchQuery.trim()}&quot; as my location</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
