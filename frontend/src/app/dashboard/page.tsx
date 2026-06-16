"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { propertyAPI } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Property } from "@/types";
import toast from "react-hot-toast";
import { Edit, Trash2, Plus, Inbox, MapPin } from "lucide-react";

export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated && user) {
      fetchMyProperties();
    }
  }, [authLoading, isAuthenticated, user]);

  const fetchMyProperties = async () => {
    setLoading(true);
    try {
      // Get all properties and filter by current user
      // (For 50k+ scale, ideally backend would have a /my-properties endpoint,
      // but we filter client side here since dashboard data is small per user)
      const response = await propertyAPI.getAll({ limit: 100 });
      const myProperties = response.data.data.filter(
        (p: Property) => p.user_id === user?.id,
      );
      setProperties(myProperties);
    } catch (error) {
      toast.error("Failed to load your properties");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    setDeletingId(id);
    try {
      await propertyAPI.delete(id);
      toast.success("Property deleted successfully");
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <LoadingSpinner size="lg" />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Listings</h1>
            <p className="text-gray-500">Manage your property listings</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/dashboard/leads">
              <Button variant="outline" className="flex items-center gap-1">
                <Inbox size={16} />
                View Inquiries
              </Button>
            </Link>
            <Link href="/properties/new">
              <Button className="flex items-center gap-1">
                <Plus size={16} />
                Add Property
              </Button>
            </Link>
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <p className="text-gray-500 mb-4">
              You haven&apos;t listed any properties yet
            </p>
            <Link href="/properties/new">
              <Button>List Your First Property</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {properties.map((property) => (
              <div
                key={property.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b last:border-b-0 hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-blue-400 flex-shrink-0">
                    {property.images?.[0] ? (
                      <img
                        src={property.images[0]}
                        alt=""
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <MapPin size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {property.title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {property.city} • ₹
                      {Number(property.price).toLocaleString("en-IN")}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        property.is_available
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {property.is_available ? "Active" : "Sold"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/properties/${property.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit size={14} />
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    loading={deletingId === property.id}
                    onClick={() => handleDelete(property.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
