const pool = require("../../config/db");

const imageBlobToDataUrl = (row) => {
  if (!row.blob || !Buffer.isBuffer(row.blob)) return null;
  const mimeType = row.blob_mime_type || "image/jpeg";
  return `data:${mimeType};base64,${row.blob.toString("base64")}`;
};

const serializeProperty = (row) => {
  const imageDataUrl = imageBlobToDataUrl(row);
  return {
    ...row,
    blob: imageDataUrl,
    images: imageDataUrl ? [imageDataUrl] : row.images,
  };
};

const decodeImageBlob = (blob) => {
  if (!blob) return null;
  const dataUrlMatch = blob.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  const base64 = dataUrlMatch ? dataUrlMatch[2] : blob;
  return Buffer.from(base64, "base64");
};

// ─── Create Property ────────────────────────────────
const createProperty = async (userId, data) => {
  const {
    title, description, price, property_type,
    bedrooms, bathrooms, area_sqft, city,
    locality, address, latitude, longitude,
    blob, blob_mime_type, blob_file_name,
  } = data;

  const imageBlob = decodeImageBlob(blob);

  const result = await pool.query(
    `INSERT INTO properties 
      (user_id, title, description, price, property_type,
       bedrooms, bathrooms, area_sqft, city, locality,
       address, latitude, longitude, blob, blob_mime_type, blob_file_name)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
     RETURNING *`,
    [
      userId, title, description, price, property_type,
      bedrooms, bathrooms, area_sqft, city, locality,
      address, latitude, longitude, imageBlob, blob_mime_type, blob_file_name,
    ],
  );

  return serializeProperty(result.rows[0]);
};

// ─── Get All Properties (Search + Filter + Pagination) ──
const getAllProperties = async (filters) => {
  const {
    city, min_price, max_price, property_type, bedrooms,
    sort_by = "created_at", sort_order = "DESC",
    page = 1, limit = 10,
  } = filters;

  let conditions = ["p.is_available = true"];
  let values = [];
  let paramCount = 1;

  if (city) {
    conditions.push(`p.city ILIKE $${paramCount}`);
    values.push(`%${city}%`);
    paramCount++;
  }
  if (min_price) {
    conditions.push(`p.price >= $${paramCount}`);
    values.push(min_price);
    paramCount++;
  }
  if (max_price) {
    conditions.push(`p.price <= $${paramCount}`);
    values.push(max_price);
    paramCount++;
  }
  if (property_type) {
    conditions.push(`p.property_type = $${paramCount}`);
    values.push(property_type);
    paramCount++;
  }

  if (bedrooms) {
    if (Number(bedrooms) >= 4) {
      conditions.push(`p.bedrooms >= $${paramCount}`)
    } else {
      conditions.push(`p.bedrooms = $${paramCount}`)
    }
    values.push(bedrooms)
    paramCount++
  }

  const allowedSortColumns = ["price", "created_at", "area_sqft", "bedrooms"];
  const sortColumn = allowedSortColumns.includes(sort_by) ? sort_by : "created_at";
  const sortDirection = sort_order.toUpperCase() === "ASC" ? "ASC" : "DESC";

  const offset = (page - 1) * limit;
  values.push(limit, offset);

  const whereClause = conditions.join(" AND ");

  const query = `
    SELECT p.*, u.name as owner_name, u.phone as owner_phone
    FROM properties p
    JOIN users u ON p.user_id = u.id
    WHERE ${whereClause}
    ORDER BY p.${sortColumn} ${sortDirection}
    LIMIT $${paramCount} OFFSET $${paramCount + 1}
  `;

  const countQuery = `SELECT COUNT(*) FROM properties p WHERE ${whereClause}`;

  const [dataResult, countResult] = await Promise.all([
    pool.query(query, values),
    pool.query(countQuery, values.slice(0, -2)),
  ]);

  const total = parseInt(countResult.rows[0].count);
  const totalPages = Math.ceil(total / limit);

  return {
    properties: dataResult.rows.map(serializeProperty),
    pagination: {
      total,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    },
  };
};

// ─── Get Single Property ────────────────────────────
const getPropertyById = async (id) => {
  const result = await pool.query(
    `SELECT p.*, u.name as owner_name, u.phone as owner_phone, u.email as owner_email
     FROM properties p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = $1`,
    [id],
  );

  if (result.rows.length === 0) {
    const error = new Error("Property not found");
    error.statusCode = 404;
    throw error;
  }

  // ✅ serialize so blob + blob_file_name are returned
  return serializeProperty(result.rows[0]);
};

// ─── Update Property ────────────────────────────────
const updateProperty = async (id, userId, data) => {
  const existing = await pool.query("SELECT * FROM properties WHERE id = $1", [id]);

  if (existing.rows.length === 0) {
    const error = new Error("Property not found");
    error.statusCode = 404;
    throw error;
  }

  if (existing.rows[0].user_id !== userId) {
    const error = new Error("Unauthorized - you can only edit your own properties");
    error.statusCode = 403;
    throw error;
  }

  const {
    title, description, price, property_type,
    bedrooms, bathrooms, area_sqft, city,
    locality, address, images, is_available,
    blob, blob_mime_type, blob_file_name,
  } = data;

  const imageBlob = blob ? decodeImageBlob(blob) : undefined;

  const result = await pool.query(
    `UPDATE properties SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      price = COALESCE($3, price),
      property_type = COALESCE($4, property_type),
      bedrooms = COALESCE($5, bedrooms),
      bathrooms = COALESCE($6, bathrooms),
      area_sqft = COALESCE($7, area_sqft),
      city = COALESCE($8, city),
      locality = COALESCE($9, locality),
      address = COALESCE($10, address),
      images = COALESCE($11, images),
      is_available = COALESCE($12, is_available),
      blob = COALESCE($13, blob),
      blob_mime_type = COALESCE($14, blob_mime_type),
      blob_file_name = COALESCE($15, blob_file_name),
      updated_at = NOW()
     WHERE id = $16 AND user_id = $17
     RETURNING *`,
    [
      title, description, price, property_type,
      bedrooms, bathrooms, area_sqft, city,
      locality, address, images, is_available,
      imageBlob || null, blob_mime_type || null, blob_file_name || null,
      id, userId,
    ],
  );

  return serializeProperty(result.rows[0]);
};

// ─── Delete Property ────────────────────────────────
const deleteProperty = async (id, userId) => {
  const existing = await pool.query("SELECT * FROM properties WHERE id = $1", [id]);

  if (existing.rows.length === 0) {
    const error = new Error("Property not found");
    error.statusCode = 404;
    throw error;
  }

  if (existing.rows[0].user_id !== userId) {
    const error = new Error("Unauthorized - you can only delete your own properties");
    error.statusCode = 403;
    throw error;
  }

  await pool.query("DELETE FROM properties WHERE id = $1", [id]);
  return { message: "Property deleted successfully" };
};

// ─── Similar Properties ─────────────────────────────
const getSimilarProperties = async (propertyId) => {
  const current = await pool.query("SELECT * FROM properties WHERE id = $1", [propertyId]);
  if (current.rows.length === 0) return [];

  const { city, property_type, price, bedrooms } = current.rows[0];

  const result = await pool.query(
    `SELECT p.*, u.name as owner_name
     FROM properties p
     JOIN users u ON p.user_id = u.id
     WHERE p.id != $1
       AND p.is_available = true
       AND p.city ILIKE $2
       AND p.property_type = $3
       AND p.price BETWEEN $4 AND $5
     ORDER BY ABS(p.bedrooms - $6) ASC, ABS(p.price - $7) ASC
     LIMIT 4`,
    [propertyId, `%${city}%`, property_type, price * 0.7, price * 1.3, bedrooms || 0, price],
  );

  return result.rows.map(serializeProperty);
};

// ─── Get City Suggestions (autocomplete) ────────────
const getCitySuggestions = async (query) => {
  const result = await pool.query(
    `SELECT DISTINCT city FROM properties WHERE city ILIKE $1 ORDER BY city ASC LIMIT 8`,
    [`${query}%`]
  );
  return result.rows.map(row => row.city);
};

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getSimilarProperties,
  getCitySuggestions,
};