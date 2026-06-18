import { Property } from "@/types";
import PropertyCard from "./PropertyCard";
import ErrorMessage from "@/components/ui/ErrorMessage";

// Card Shimmer
const CardShimmer = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <div className="h-48 bg-gray-200 animate-pulse" />
    <div className="p-4">
      <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse mb-3" />
      <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse mb-3" />
      <div className="flex gap-3">
        <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  </div>
)

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
  error?: string;
}

const PropertyGrid = ({ properties, loading, error }: PropertyGridProps) => {
  // Shimmer instead of spinner
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch mt-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <CardShimmer key={i} />
        ))}
      </div>
    )
  }

  if (error) return <ErrorMessage message={error} />;

  if (properties.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="w-16 h-16 text-gray-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="text-gray-500 text-lg font-medium">No properties found</h3>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertyGrid;