'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { Search } from 'lucide-react'

const HeroSearch = () => {
  const router = useRouter()
  const [city, setCity] = useState('')

  const handleSearch = () => {
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
    <div className="bg-white rounded-xl p-4 flex gap-3 max-w-2xl mx-auto">
      <div className="flex-1 flex items-center gap-2 text-gray-400">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search by city, locality..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full outline-none text-gray-900 placeholder:text-gray-400 text-sm"
        />
      </div>
      <Button size="md" onClick={handleSearch}>Search</Button>
    </div>
  )
}

export default HeroSearch