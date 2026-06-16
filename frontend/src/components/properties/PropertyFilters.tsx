"use client";

import { useState } from "react";
import { PropertyFilters } from "@/types";
import Button from "@/components/ui/Button";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface PropertyFiltersProps {
  onFilter: (filters: PropertyFilters) => void;
  loading?: boolean;
}

const PropertyFiltersComponent = ({
  onFilter,
  loading,
}: PropertyFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<PropertyFilters>({
    city: "",
    min_price: undefined,
    max_price: undefined,
    property_type: "",
    bedrooms: undefined,
    sort_by: "created_at",
    sort_order: "DESC",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
    }));
  };

  const handleSearch = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    const reset: PropertyFilters = {
      city: "",
      min_price: undefined,
      max_price: undefined,
      property_type: "",
      bedrooms: undefined,
      sort_by: "created_at",
      sort_order: "DESC",
    };
    setFilters(reset);
    onFilter(reset);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      {/* Main Search Row */}
      <div className="flex gap-3 flex-wrap">
        {/* City Search */}
        <div className="flex-1 min-w-[200px] relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            name="city"
            placeholder="Search by city..."
            value={filters.city || ""}
            onChange={handleChange}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Property Type */}
        <select
          name="property_type"
          value={filters.property_type || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="plot">Plot</option>
        </select>

        {/* Bedrooms */}
        <select
          name="bedrooms"
          value={filters.bedrooms || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500"
        >
          <option value="">Any BHK</option>
          <option value="1">1 BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4">4+ BHK</option>
        </select>

        {/* Advanced Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 border border-gray-300 rounded-lg px-3 py-2"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>

        {/* Search Button */}
        <Button onClick={handleSearch} loading={loading} size="md">
          Search
        </Button>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500"
        >
          <X size={16} />
          Reset
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Min Price */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Min Price (₹)
            </label>
            <input
              type="number"
              name="min_price"
              placeholder="e.g. 500000"
              value={filters.min_price || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Max Price (₹)
            </label>
            <input
              type="number"
              name="max_price"
              placeholder="e.g. 10000000"
              value={filters.max_price || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sort By</label>
            <select
              name="sort_by"
              value={filters.sort_by || "created_at"}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500"
            >
              <option value="created_at">Latest</option>
              <option value="price">Price</option>
              <option value="area_sqft">Area</option>
              <option value="bedrooms">Bedrooms</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Order</label>
            <select
              name="sort_order"
              value={filters.sort_order || "DESC"}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500"
            >
              <option value="DESC">High to Low</option>
              <option value="ASC">Low to High</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyFiltersComponent;