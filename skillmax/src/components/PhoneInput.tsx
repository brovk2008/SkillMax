'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Phone } from 'lucide-react'

export interface CountryCode {
  country: string
  code: string
  flag: string
}

export const COUNTRY_CODES: CountryCode[] = [
  { country: 'India', code: '+91', flag: '🇮🇳' },
  { country: 'United States', code: '+1', flag: '🇺🇸' },
  { country: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { country: 'United Arab Emirates', code: '+971', flag: '🇦🇪' },
  { country: 'Singapore', code: '+65', flag: '🇸🇬' },
  { country: 'Canada', code: '+1', flag: '🇨🇦' },
  { country: 'Australia', code: '+61', flag: '🇦🇺' },
  { country: 'Germany', code: '+49', flag: '🇩🇪' },
  { country: 'Japan', code: '+81', flag: '🇯🇵' },
  { country: 'International', code: '+', flag: '🌐' },
]

interface PhoneInputProps {
  value: string
  onChange: (formattedPhone: string) => void
  location?: string
  label?: string
  placeholder?: string
  className?: string
}

function getCountryFromLocationOrValue(loc: string, val: string): CountryCode {
  if (val) {
    const matched = COUNTRY_CODES.find((c) => val.startsWith(c.code))
    if (matched) return matched
  }
  if (loc) {
    const locLower = loc.toLowerCase()
    if (locLower.includes('united states') || locLower.includes('usa') || locLower.includes('california') || locLower.includes('new york')) {
      return COUNTRY_CODES[1]
    } else if (locLower.includes('united kingdom') || locLower.includes('uk') || locLower.includes('london')) {
      return COUNTRY_CODES[2]
    } else if (locLower.includes('emirates') || locLower.includes('uae') || locLower.includes('dubai')) {
      return COUNTRY_CODES[3]
    } else if (locLower.includes('singapore')) {
      return COUNTRY_CODES[4]
    } else if (locLower.includes('canada')) {
      return COUNTRY_CODES[5]
    } else if (locLower.includes('australia')) {
      return COUNTRY_CODES[6]
    } else if (locLower.includes('germany')) {
      return COUNTRY_CODES[7]
    } else if (locLower.includes('japan')) {
      return COUNTRY_CODES[8]
    }
  }
  return COUNTRY_CODES[0]
}

function getLocalNumberFromValue(val: string): string {
  if (!val) return ''
  const matched = COUNTRY_CODES.find((c) => val.startsWith(c.code))
  if (matched) {
    return val.slice(matched.code.length).trim()
  }
  return val.replace(/^[^\d]+/, '').trim()
}

export function PhoneInput({
  value,
  onChange,
  location = '',
  label = 'Phone / WhatsApp',
  placeholder = '9821400274',
  className = '',
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(() =>
    getCountryFromLocationOrValue(location, value)
  )
  const [localNumber, setLocalNumber] = useState<string>(() => getLocalNumberFromValue(value))
  const [prevLocation, setPrevLocation] = useState(location)
  const [prevValue, setPrevValue] = useState(value)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Sync state if props change (React recommended pattern without useEffect cascades)
  if (prevLocation !== location) {
    setPrevLocation(location)
    if (!value) {
      setSelectedCountry(getCountryFromLocationOrValue(location, ''))
    }
  }

  if (prevValue !== value) {
    setPrevValue(value)
    setLocalNumber(getLocalNumberFromValue(value))
    const matched = COUNTRY_CODES.find((c) => value.startsWith(c.code))
    if (matched) {
      setSelectedCountry(matched)
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    let raw = e.target.value

    // If user pasted a full number with country code like +91 9821400274, parse it
    const matched = COUNTRY_CODES.find((c) => raw.startsWith(c.code))
    if (matched) {
      setSelectedCountry(matched)
      raw = raw.slice(matched.code.length).trim()
    }

    // Keep only digits and spaces/dashes
    const cleanDigits = raw.replace(/[^\d\s-]/g, '')
    setLocalNumber(cleanDigits)

    const fullFormatted = cleanDigits ? `${selectedCountry.code} ${cleanDigits.trim()}` : ''
    onChange(fullFormatted)
  }

  function handleCountrySelect(country: CountryCode) {
    setSelectedCountry(country)
    setIsDropdownOpen(false)
    const fullFormatted = localNumber ? `${country.code} ${localNumber.trim()}` : ''
    onChange(fullFormatted)
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>}

      <div className="flex rounded-lg border border-slate-300 bg-white focus-within:border-emerald-600 shadow-xs transition-colors overflow-hidden">
        {/* Country Code & Flag Selector Trigger */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-1.5 bg-slate-50 border-r border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          title="Change Country Code"
        >
          <span className="text-base leading-none">{selectedCountry.flag}</span>
          <span className="font-mono font-bold text-slate-900">{selectedCountry.code}</span>
          <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Local Number Input */}
        <div className="relative flex-1 flex items-center">
          <Phone className="absolute left-3 h-3.5 w-3.5 text-slate-400 shrink-0" />
          <input
            type="tel"
            value={localNumber}
            onChange={handleNumberChange}
            placeholder={placeholder}
            className="w-full pl-8 pr-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
        </div>
      </div>

      {/* Country Code Dropdown */}
      {isDropdownOpen && (
        <div className="absolute left-0 z-50 mt-1 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-150">
          <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Country Code</p>
          <div className="max-h-48 overflow-y-auto space-y-0.5 text-xs">
            {COUNTRY_CODES.map((item) => {
              const isSelected = selectedCountry.code === item.code && selectedCountry.country === item.country
              return (
                <div
                  key={`${item.country}-${item.code}`}
                  onClick={() => handleCountrySelect(item)}
                  className={`flex items-center justify-between rounded-md px-2.5 py-1.5 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.flag}</span>
                    <span>{item.country}</span>
                  </div>
                  <span className={`font-mono font-semibold ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                    {item.code}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
