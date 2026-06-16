import { Home } from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <Home size={24} />
              RealEstate
            </div>
            <p className="text-sm text-gray-400">
              Find your dream home across India. Verified listings, trusted owners.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/properties" className="hover:text-white transition-colors">All Properties</Link></li>
              <li><Link href="/properties/new" className="hover:text-white transition-colors">List Property</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-white font-semibold mb-3">Property Types</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/properties?property_type=apartment" className="hover:text-white transition-colors">Apartments</Link></li>
              <li><Link href="/properties?property_type=villa" className="hover:text-white transition-colors">Villas</Link></li>
              <li><Link href="/properties?property_type=house" className="hover:text-white transition-colors">Houses</Link></li>
              <li><Link href="/properties?property_type=plot" className="hover:text-white transition-colors">Plots</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
          © 2026 RealEstate Platform. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer