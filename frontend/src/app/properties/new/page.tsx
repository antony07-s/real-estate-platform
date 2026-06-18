"use client";

import { useState, useEffect, type WheelEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { propertyAPI } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import useDocumentTitle from "@/hooks/useDocumentTitle";

const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(255),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  property_type: z.enum(["apartment", "house", "villa", "plot"]),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  area_sqft: z.coerce.number().positive().optional(),
  city: z.string().min(1, "City is required"),
  locality: z.string().optional(),
  address: z.string().optional(),
});

type PropertyFormInput = z.input<typeof propertySchema>;
type PropertyFormData = z.output<typeof propertySchema>;

const preventNumberInputWheel = (
  event: WheelEvent<HTMLInputElement>,
) => {
  event.currentTarget.blur();
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const removeEmptyOptionalFields = (payload: Record<string, unknown>) => {
  ["description", "locality", "address"].forEach((field) => {
    if (payload[field] === "") {
      delete payload[field];
    }
  });
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "error" in error.response.data &&
    typeof error.response.data.error === "string"
  ) {
    return error.response.data.error;
  }

  return fallback;
};

export default function NewPropertyPage() {
  useDocumentTitle("List Your Property");

  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormInput, unknown, PropertyFormData>({
    resolver: zodResolver(propertySchema),
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please login to list a property");
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  const onSubmit = async (data: PropertyFormData) => {
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = { ...data };
      removeEmptyOptionalFields(payload);

      if (imageFile) {
        payload.blob = await readFileAsDataUrl(imageFile);
        payload.blob_mime_type = imageFile.type;
        payload.blob_file_name = imageFile.name;
      }

      const response = await propertyAPI.create(payload);
      toast.success("Property listed successfully!");
      router.push(`/properties/${response.data.data.id}`);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to create listing"));
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-3 py-6 sm:px-4 sm:py-10 flex-1 w-full">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
          List Your Property
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mb-6">
          Fill in the details to create a new listing
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col gap-4"
        >
          <Input
            label="Title *"
            placeholder="e.g. Spacious 2BHK Apartment in Anna Nagar"
            {...register("title")}
            error={errors.title?.message}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Describe your property..."
              className="w-full min-w-0 resize-y border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Price (₹) *"
              type="number"
              placeholder="5000000"
              min={0}
              {...register("price")}
              error={errors.price?.message}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Property Type
              </label>
              <select
                {...register("property_type")}
                className="w-full min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Bedrooms"
              type="number"
              placeholder="0"
              min={0}
              {...register("bedrooms")}
              onWheel={preventNumberInputWheel}
              error={errors.bedrooms?.message}
            />
            <Input
              label="Bathrooms"
              type="number"
              placeholder="0"
              min={0}
              {...register("bathrooms")}
              onWheel={preventNumberInputWheel}
              error={errors.bathrooms?.message}
            />
            <Input
              label="Area (sqft) *"
              type="number"
              placeholder="1200"
              min={0}
              {...register("area_sqft")}
              error={errors.area_sqft?.message}
            />
          </div>

          <Input
            label="City *"
            placeholder="Chennai"
            {...register("city")}
            error={errors.city?.message}
          />
          <Input
            label="Locality"
            placeholder="Anna Nagar"
            {...register("locality")}
          />
          <Input
            label="Address"
            placeholder="123 Main Street"
            {...register("address")}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Property Image
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(event) =>
                setImageFile(event.target.files?.[0] ?? null)
              }
              className="w-full min-w-0 border rounded-lg p-2 text-sm text-gray-900 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-sm file:text-gray-700"
            />
          </div>

          <Button type="submit" loading={submitting} className="w-full mt-2">
            List Property
          </Button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
