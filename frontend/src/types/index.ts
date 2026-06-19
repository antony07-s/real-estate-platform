//  User 
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
}

//  Property 
export interface Property {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  price: number;
  property_type: "apartment" | "house" | "villa" | "plot";
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  city: string;
  locality?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  blob?: string;
  blob_mime_type?: string;
  blob_file_name?: string;
  images?: string[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
}

//  Lead 
export interface Lead {
  id: number;
  property_id: number;
  sender_id: number;
  owner_id: number;
  message: string;
  status: "pending" | "responded" | "closed";
  created_at: string;
  property_title?: string;
  property_city?: string;
  property_price?: number;
  sender_name?: string;
  sender_email?: string;
  sender_phone?: string;
}

//  API Response 
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

//  Pagination 
export interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

//  Property Filters 
export interface PropertyFilters {
  city?: string;
  min_price?: number;
  max_price?: number;
  property_type?: string;
  bedrooms?: number;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
  page?: number;
  limit?: number;
}
