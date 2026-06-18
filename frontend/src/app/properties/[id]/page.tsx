import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SimilarProperties from "@/components/properties/SimilarProperties";
import InquiryForm from "@/components/leads/InquiryForm";
import { Property } from "@/types";
import { MapPin, Bed, Bath, Square, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { Home } from "lucide-react";
import { API_BASE_URL, SITE_URL } from "@/lib/config";
// ─── Fetch property data on the SERVER ──────────────
async function getProperty(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/properties/${id}`, {
      next: { revalidate: 60 }, // ISR: re-fetch fresh data every 60 seconds
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

const getPropertyLocation = (property: Property) =>
  [property.locality, property.city].filter(Boolean).join(", ");

const getSeoPrice = (property: Property) =>
  `INR ${Number(property.price).toLocaleString("en-IN")}`;

const getSeoDescription = (property: Property) => {
  const fallbackParts = [
    property.bedrooms ? `${property.bedrooms} BHK` : null,
    property.property_type,
    `for sale in ${getPropertyLocation(property) || property.city}`,
    `priced at ${getSeoPrice(property)}`,
  ].filter(Boolean);

  return (property.description || fallbackParts.join(" "))
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
};

// ─── Dynamic SEO Metadata ────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await getProperty(id);

  if (!data) {
    return { title: "Property Not Found" };
  }

  const property: Property = data.property;
  const location = getPropertyLocation(property);
  const canonicalUrl = `${SITE_URL}/properties/${property.id}`;
  const description = getSeoDescription(property);
  const title = `${property.title} in ${property.city}`;
  const image = property.images?.[0];

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "RealEstate Platform",
      locale: "en_IN",
      type: "website",
      images: image
        ? [
            {
              url: image,
              alt: `${property.title} in ${location || property.city}`,
            },
          ]
        : [],
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : [],
    },
    robots: {
      index: property.is_available,
      follow: true,
    },
  };
}

const formatPrice = (price: number) => {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString("en-IN")}`;
};

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getProperty(id);

  if (!data) {
    notFound(); // shows Next.js 404 page
  }

  const property: Property = data.property;
  const similarProperties: Property[] = data.similarProperties || [];
  const location = getPropertyLocation(property);
  const canonicalUrl = `${SITE_URL}/properties/${property.id}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: property.title,
    description: getSeoDescription(property),
    image: property.images || [],
    url: canonicalUrl,
    category: property.property_type,
    offers: {
      "@type": "Offer",
      price: Number(property.price),
      priceCurrency: "INR",
      availability: property.is_available
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
      url: canonicalUrl,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: location || property.city,
      addressCountry: "IN",
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Image */}
        <div className="rounded-xl overflow-hidden h-64 sm:h-80 md:h-[28rem] lg:h-[38rem] bg-linear-to-br from-blue-100 to-blue-200 mb-6 relative">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-blue-300">
              <Home size={64} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2">
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full capitalize">
              {property.property_type}
            </span>

            <h1 className="text-3xl font-bold text-gray-800 mt-3 mb-2">
              {property.title}
            </h1>

            <div className="flex items-center gap-1 text-gray-500 mb-4">
              <MapPin size={16} />
              <span>
                {property.locality ? `${property.locality}, ` : ""}
                {property.city}
              </span>
            </div>

            <div className="text-3xl font-bold text-blue-600 mb-6">
              {formatPrice(Number(property.price))}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 bg-white rounded-xl p-5 shadow-sm mb-6">
              {property.bedrooms !== undefined &&
                property.bedrooms !== null && (
                  <div className="flex flex-col items-center text-center">
                    <Bed className="text-blue-600 mb-1" size={22} />
                    <span className="font-semibold text-gray-700">
                      {property.bedrooms}
                    </span>
                    <span className="text-xs text-gray-400">Bedrooms</span>
                  </div>
                )}
              {property.bathrooms !== undefined &&
                property.bathrooms !== null && (
                  <div className="flex flex-col items-center text-center">
                    <Bath className="text-blue-600 mb-1" size={22} />
                    <span className="font-semibold text-gray-700">
                      {property.bathrooms}
                    </span>
                    <span className="text-xs text-gray-400">Bathrooms</span>
                  </div>
                )}
              {property.area_sqft && (
                <div className="flex flex-col items-center text-center">
                  <Square className="text-blue-600 mb-1" size={22} />
                  <span className="font-semibold text-gray-700">
                    {property.area_sqft}
                  </span>
                  <span className="text-xs text-gray-400">Sqft</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-2">Description</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {property.description || "No description provided."}
              </p>

              {property.address && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-semibold text-gray-700 text-sm mb-1">
                    Address
                  </h3>
                  <p className="text-gray-500 text-sm">{property.address}</p>
                </div>
              )}

              <div className="flex items-center gap-1 text-gray-400 text-xs mt-4">
                <Calendar size={12} />
                Listed on{" "}
                {new Date(property.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* Right - Inquiry Form */}
          <div>
            <InquiryForm
              propertyId={property.id}
              ownerName={property.owner_name || "Owner"}
              ownerPhone={property.owner_phone}
              ownerEmail={property.owner_email}
            />
          </div>
        </div>

        {/* Similar Properties */}
        <SimilarProperties properties={similarProperties} />
      </div>

      <Footer />
    </div>
  );
}
