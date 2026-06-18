"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { propertyAPI } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { Property } from "@/types";
import toast from "react-hot-toast";
import { Edit, Trash2, Plus, Inbox, MapPin, Loader2, AlertTriangle } from "lucide-react";
import useDocumentTitle from "@/hooks/useDocumentTitle";

// Shimmer UI
const DashboardShimmer = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <div className="h-16 bg-white shadow-sm" />
    <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="h-7 w-40 bg-gray-200 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-56 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-36 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-9 w-32 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 border-b last:border-b-0">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
              <div>
                <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mb-2" />
                <div className="h-4 w-16 bg-gray-100 rounded-full animate-pulse" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

//  Delete 
const DeleteModal = ({
  property,
  onConfirm,
  onCancel,
  loading,
}: {
  property: Property
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    />
    {/* Modal */}
    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col items-center text-center gap-4">
      <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
        <AlertTriangle size={28} className="text-red-500" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-1">Delete Property?</h2>
        <p className="text-gray-500 text-sm">
          Are you sure you want to delete{" "}
          <span className="font-medium text-gray-700">"{property.title}"</span>?
          This action cannot be undone.
        </p>
      </div>
      <div className="flex gap-3 w-full">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Trash2 size={15} />
          )}
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
)

//  Main Page 
export default function DashboardPage() {
  useDocumentTitle("My Listings");

  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    if (isAuthenticated && user) fetchMyProperties();
  }, [authLoading, isAuthenticated, user]);

  const fetchMyProperties = async () => {
    setLoading(true);
    try {
      const response = await propertyAPI.getAll({ limit: 100 });
      const myProperties = response.data.data.filter(
        (p: Property) => p.user_id === user?.id
      );
      setProperties(myProperties);
    } catch (error) {
      toast.error("Failed to load your properties");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      await propertyAPI.delete(deleteTarget.id);
      toast.success("Property deleted successfully");
      setProperties((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
    router.push(`/properties/${id}/edit`);
  };

  if (authLoading || loading) return <DashboardShimmer />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          property={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deletingId === deleteTarget.id}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Listings</h1>
            <p className="text-gray-500 text-sm">Manage your property listings</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/dashboard/leads">
              <Button variant="outline" className="flex items-center gap-2 text-sm">
                <Inbox size={16} />
                View Inquiries
              </Button>
            </Link>
            <Link href="/properties/new">
              <Button className="flex items-center gap-2 text-sm">
                <Plus size={16} />
                Add Property
              </Button>
            </Link>
          </div>
        </div>

        {/* Empty state */}
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
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b last:border-b-0 hover:bg-gray-50 transition"
              >
                {/* Property Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-blue-400 flex-shrink-0 overflow-hidden">
                    {property.images?.[0] ? (
                      <img
                        src={property.images[0]}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <MapPin size={20} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {property.title}
                    </h3>
                    <p className="text-gray-500 text-sm truncate">
                      {property.city} • ₹{Number(property.price).toLocaleString("en-IN")}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${property.is_available
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                        }`}
                    >
                      {property.is_available ? "Active" : "Sold"}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 sm:flex-shrink-0">
                  {/* Edit with loader */}
                  <button
                    onClick={() => handleEdit(property.id)}
                    disabled={editingId === property.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    {editingId === property.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Edit size={14} />
                    )}
                    <span className="hidden sm:inline">Edit</span>
                  </button>

                  {/* Delete opens modal */}
                  <button
                    onClick={() => setDeleteTarget(property)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium hover:bg-red-100 transition"
                  >
                    <Trash2 size={14} />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
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
