import { Property } from "@/types";
import PropertyCard from "./PropertyCard";

interface SimilarPropertiesProps {
  properties: Property[];
}

const SimilarProperties = ({ properties }: SimilarPropertiesProps) => {
  if (properties.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Similar Properties
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default SimilarProperties;
