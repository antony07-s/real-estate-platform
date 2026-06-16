"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { leadAPI } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Lead } from "@/types";
import toast from "react-hot-toast";
import { Phone, Mail, MessageSquare, ArrowLeft } from "lucide-react";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  responded: "bg-blue-100 text-blue-700",
  closed: "bg-gray-100 text-gray-500",
};

export default function LeadsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    if (isAuthenticated) fetchLeads();
  }, [authLoading, isAuthenticated]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await leadAPI.getReceived();
      setLeads(response.data.data);
    } catch (error) {
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId: number, status: string) => {
    setUpdatingId(leadId);
    try {
      await leadAPI.updateStatus(leadId, status);
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId ? { ...l, status: status as Lead["status"] } : l,
        ),
      );
      toast.success("Status updated");
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
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

      <div className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-gray-500 text-sm mb-4 hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Inquiries Received
        </h1>
        <p className="text-gray-500 mb-6">Manage leads for your properties</p>

        {leads.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <MessageSquare className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-500">No inquiries yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {leads.map((lead) => (
              <div key={lead.id} className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {lead.property_title}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      {lead.property_city} • ₹
                      {Number(lead.property_price).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full capitalize ${statusColors[lead.status]}`}
                  >
                    {lead.status}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-gray-700 text-sm">{lead.message}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1 text-sm text-gray-500">
                    <span className="font-medium text-gray-700">
                      {lead.sender_name}
                    </span>
                    {lead.sender_phone && (
                      <div className="flex items-center gap-1">
                        <Phone size={12} /> {lead.sender_phone}
                      </div>
                    )}
                    {lead.sender_email && (
                      <div className="flex items-center gap-1">
                        <Mail size={12} /> {lead.sender_email}
                      </div>
                    )}
                  </div>

                  <select
                    value={lead.status}
                    disabled={updatingId === lead.id}
                    onChange={(e) =>
                      handleStatusChange(lead.id, e.target.value)
                    }
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700"
                  >
                    <option value="pending">Pending</option>
                    <option value="responded">Responded</option>
                    <option value="closed">Closed</option>
                  </select>
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
