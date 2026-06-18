"use client";

import { useState, useEffect, type WheelEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { propertyAPI } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import toast from "react-hot-toast";

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
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type PropertyFormInput = z.input<typeof propertySchema>;
type PropertyFormData = z.output<typeof propertySchema>;

const preventNumberInputWheel = (
  event: WheelEvent<HTMLInputElement>,
) => {
  event.currentTarget.blur();
};

export default function EditPropertyPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notOwner, setNotOwner] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PropertyFormInput>({
    resolver: zodResolver(propertySchema),
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    if (isAuthenticated) fetchProperty();
  }, [authLoading, isAuthenticated]);

  const fetchProperty = async () => {
    try {
      const response = await propertyAPI.getById(Number(id));
      const property = response.data.data.property;

      if (property.user_id !== user?.id) {
        setNotOwner(true);
        return;
      }

      reset({
        title: property.title,
        description: property.description || "",
        price: property.price,
        property_type: property.property_type,
        bedrooms: property.bedrooms ?? 0,
        bathrooms: property.bathrooms ?? 0,
        area_sqft: property.area_sqft ?? 0,
        city: property.city,
        locality: property.locality || "",
        address: property.address || "",
        image_url: property.images?.[0] || "",
      });
    } catch (error) {
      toast.error("Property not found");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PropertyFormData) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        images: data.image_url ? [data.image_url] : undefined,
      };
      delete (payload as any).image_url;

      await propertyAPI.update(Number(id), payload);
      toast.success("Property updated successfully!");
      router.push(`/properties/${id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update");
    } finally {
      setSubmitting(false);
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

  if (notOwner) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500 font-medium">
            You can only edit your own properties
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-10 flex-1 w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Edit Property</h1>
        <p className="text-gray-500 mb-6">Update your listing details</p>

        <form
          onSubmit={handleSubmit(onSubmit as any)}
          className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4"
        >
          <Input
            label="Title"
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
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (₹)"
              type="number"
              {...register("price")}
              error={errors.price?.message}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Property Type
              </label>
              <select
                {...register("property_type")}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Bedrooms"
              type="number"
              {...register("bedrooms")}
              onWheel={preventNumberInputWheel}
              error={errors.bedrooms?.message}
            />
            <Input
              label="Bathrooms"
              type="number"
              {...register("bathrooms")}
              onWheel={preventNumberInputWheel}
              error={errors.bathrooms?.message}
            />
            <Input
              label="Area (sqft)"
              type="number"
              {...register("area_sqft")}
              error={errors.area_sqft?.message}
            />
          </div>

          <Input
            label="City"
            {...register("city")}
            error={errors.city?.message}
          />
          <Input label="Locality" {...register("locality")} />
          <Input label="Address" {...register("address")} />
          <Input
            label="Image URL (optional)"
            placeholder="https://example.com/photo.jpg"
            {...register("image_url")}
            error={errors.image_url?.message}
          />

          <Button type="submit" loading={submitting} className="w-full mt-2">
            Update Property
          </Button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
