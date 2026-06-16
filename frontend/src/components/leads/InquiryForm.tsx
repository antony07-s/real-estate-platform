"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { leadAPI } from "@/lib/api";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { MessageSquare, Phone, Mail } from "lucide-react";

interface InquiryFormProps {
  propertyId: number;
  ownerName: string;
  ownerPhone?: string;
  ownerEmail?: string;
}

const InquiryForm = ({
  propertyId,
  ownerName,
  ownerPhone,
  ownerEmail,
}: InquiryFormProps) => {
  const { isAuthenticated } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (message.length < 10) {
      toast.error("Message must be at least 10 characters");
      return;
    }

    setLoading(true);
    try {
      await leadAPI.create({ property_id: propertyId, message });
      toast.success("Inquiry sent successfully!");
      setSent(true);
      setMessage("");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to send inquiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
      {/* Owner Info */}
      <h3 className="text-lg font-bold text-gray-800 mb-1">Contact Owner</h3>
      <p className="text-gray-600 text-sm mb-4">{ownerName}</p>

      <div className="flex flex-col gap-2 mb-5">
        {ownerPhone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone size={14} className="text-blue-500" />
            {ownerPhone}
          </div>
        )}
        {ownerEmail && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail size={14} className="text-blue-500" />
            {ownerEmail}
          </div>
        )}
      </div>

      {!isAuthenticated ? (
        <div className="text-center py-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-sm mb-3">Login to contact owner</p>
          <a href="/login">
            <Button size="sm" className="w-full">
              Login to Inquire
            </Button>
          </a>
        </div>
      ) : sent ? (
        <div className="text-center py-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-600 font-medium">Inquiry Sent!</p>
          <p className="text-green-500 text-sm mt-1">
            Owner will contact you soon
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <MessageSquare size={16} className="text-blue-500" />
            Send Message
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hi, I am interested in this property. Please contact me."
            rows={4}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
          />
          <Button onClick={handleSubmit} loading={loading} className="w-full">
            Send Inquiry
          </Button>
        </div>
      )}
    </div>
  );
};

export default InquiryForm;
