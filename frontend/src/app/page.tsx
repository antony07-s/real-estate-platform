import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import HeroSearch from "@/components/HeroSearch";
import {
  Search,
  Home,
  Shield,
  TrendingUp,
  Building2,
  Warehouse,
  TreePine,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Dream Home
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-10">
            Browse thousands of verified properties across India. Buy, sell or
            rent with confidence.
          </p>

          <HeroSearch />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-10 border-b">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">50,000+</div>
            <div className="text-gray-500 text-sm mt-1">Properties Listed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">10,000+</div>
            <div className="text-gray-500 text-sm mt-1">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">100+</div>
            <div className="text-gray-500 text-sm mt-1">Cities Covered</div>
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
            Browse by Type
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { type: "apartment", label: "Apartments", icon: Building2 },
              { type: "house", label: "Houses", icon: Home },
              { type: "villa", label: "Villas", icon: Warehouse },
              { type: "plot", label: "Plots", icon: TreePine },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.type}
                  href={`/properties?property_type=${item.type}`}
                >
                  <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                    <div className="flex justify-center mb-3">
                      <div className="bg-blue-50 group-hover:bg-blue-100 p-3 rounded-full transition-colors">
                        <Icon className="text-blue-600" size={28} />
                      </div>
                    </div>
                    <div className="font-semibold text-gray-700">
                      {item.label}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="text-blue-600" size={32} />,
                title: "Verified Listings",
                desc: "All properties are verified by our team before listing.",
              },
              {
                icon: <Home className="text-blue-600" size={32} />,
                title: "No Brokerage",
                desc: "Connect directly with owners. No middlemen, no extra charges.",
              },
              {
                icon: <TrendingUp className="text-blue-600" size={32} />,
                title: "Best Prices",
                desc: "Get the best market rates with our price comparison tool.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-gray-50">
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Find Your Home?</h2>
        <p className="text-blue-100 mb-8">
          Join thousands of happy customers who found their dream home with us.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/properties">
            <Button variant="secondary" size="lg">
              Browse Properties
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="hover:bg-blue-50">
              List Your Property
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
