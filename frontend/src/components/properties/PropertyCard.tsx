import Link from "next/link";
import { Property } from "@/types";
import { MapPin, Bed, Bath, Square, IndianRupee } from "lucide-react";

interface PropertyCardProps {
  property: Property;
}

const formatPrice = (price: number) => {
  if (price >= 10000000) return `${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(1)} L`;
  return price.toLocaleString("en-IN");
};

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer border border-gray-100 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 bg-linear-to-br from-blue-100 to-blue-200">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-blue-400">
              <svg
                className="w-16 h-16"
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
                <polyline
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  points="9 22 9 12 15 12 15 22"
                />
              </svg>
            </div>
          )}

          {/* Property Type Badge */}
          <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full capitalize">
            {property.property_type}
          </span>

          {/* Available Badge */}
          {!property.is_available && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Sold
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Price */}
          <div className="flex items-center gap-1 text-blue-600 font-bold text-xl mb-1">
            <IndianRupee size={18} />
            {formatPrice(Number(property.price))}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
            <MapPin size={14} />
            <span>
              {property.locality ? `${property.locality}, ` : ""}
              {property.city}
            </span>
          </div>

          {/* Features */}
          <div className="flex items-center gap-4 text-gray-600 text-sm border-t pt-3 mt-auto">
            {property.bedrooms !== undefined && property.bedrooms !== null && (
              <div className="flex items-center gap-1">
                <Bed size={14} />
                <span>{property.bedrooms} BHK</span>
              </div>
            )}
            {property.bathrooms !== undefined &&
              property.bathrooms !== null && (
                <div className="flex items-center gap-1">
                  <Bath size={14} />
                  <span>{property.bathrooms} Bath</span>
                </div>
              )}
            {property.area_sqft && (
              <div className="flex items-center gap-1">
                <Square size={14} />
                <span>{property.area_sqft} sqft</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
