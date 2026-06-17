'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { Search, MapPin } from 'lucide-react'
import api from '@/lib/api'

const HeroSearch = () => {
  const router = useRouter()
  const [city, setCity] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Fetch suggestions as user types (debounced)
  useEffect(() => {
    if (!city.trim()) {
      setSuggestions([])
      return
    }

    const timer = setTimeout(async () => {
      try {
        const res = await api.get('/properties/cities', { params: { q: city } })
        setSuggestions(res.data.data)
        setShowDropdown(true)
      } catch {
        setSuggestions([])
      }
    }, 300) // wait 300ms after typing stops before calling API

    return () => clearTimeout(timer)
  }, [city])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const goToCity = (selectedCity: string) => {
    setCity(selectedCity)
    setShowDropdown(false)
    router.push(`/properties?city=${encodeURIComponent(selectedCity)}`)
  }

  const handleSearch = () => {
    setShowDropdown(false)
    if (city.trim()) {
      router.push(`/properties?city=${encodeURIComponent(city.trim())}`)
    } else {
      router.push('/properties')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div ref={wrapperRef} className="relative max-w-2xl mx-auto">
      <div className="bg-white rounded-xl p-4 flex gap-3">
        <div className="flex-1 flex items-center gap-2 text-gray-400">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by city, locality..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            className="w-full outline-none text-gray-900 placeholder:text-gray-400 text-sm"
          />
        </div>
        <Button size="md" onClick={handleSearch}>Search</Button>
      </div>

      {/* Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => goToCity(s)}
              className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors"
            >
              <MapPin size={14} className="text-gray-400" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default HeroSearch