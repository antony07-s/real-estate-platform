'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PropertyFilters from '@/components/properties/PropertyFilters'
import PropertyGrid from '@/components/properties/PropertyGrid'
import Button from '@/components/ui/Button'
import { propertyAPI } from '@/lib/api'
import { Property, PropertyFilters as Filters, Pagination } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function PropertiesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [properties, setProperties] = useState<Property[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)

  // Read filters from URL on first load
  const initialFilters: Filters = {
    city: searchParams.get('city') || undefined,
    property_type: searchParams.get('property_type') || undefined,
    bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
  }

  const fetchProperties = useCallback(async (filters: Filters, currentPage: number) => {
    setLoading(true)
    setError('')
    try {
      const response = await propertyAPI.getAll({ ...filters, page: currentPage, limit: 12 })
      setProperties(response.data.data)
      setPagination(response.data.pagination)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load properties')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch on mount
  useEffect(() => {
    fetchProperties(initialFilters, 1)
  }, [])

  const handleFilter = (filters: Filters) => {
    setPage(1)
    fetchProperties(filters, 1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    fetchProperties(initialFilters, newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Find Your Property
        </h1>
        <p className="text-gray-500 mb-6">
          {pagination ? `${pagination.total} properties found` : 'Loading...'}
        </p>

        <PropertyFilters onFilter={handleFilter} loading={loading} />

        <PropertyGrid properties={properties} loading={loading} error={error} />

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              <ChevronLeft size={16} />
              Prev
            </Button>

            <span className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page === pagination.totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}