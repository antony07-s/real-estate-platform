const propertyService = require("./property.service");
const Joi = require("joi");

// ─── Validation Schema ──────────────────────────────
const propertySchema = Joi.object({
  title: Joi.string().min(5).max(255).required(),
  description: Joi.string().optional(),
  price: Joi.number().positive().required(),
  property_type: Joi.string()
    .valid("apartment", "house", "villa", "plot")
    .required(),
  bedrooms: Joi.number().integer().min(0).optional(),
  bathrooms: Joi.number().integer().min(0).optional(),
  area_sqft: Joi.number().positive().optional(),
  city: Joi.string().required(),
  locality: Joi.string().optional(),
  address: Joi.string().optional(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
});

// ─── Create Property ────────────────────────────────
const createProperty = async (req, res, next) => {
  try {
    const { error, value } = propertySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    // req.user.userId comes from auth middleware
    const property = await propertyService.createProperty(
      req.user.userId,
      value,
    );

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get All Properties ─────────────────────────────
const getAllProperties = async (req, res, next) => {
  try {
    // All filters come from query params
    // e.g. /api/properties?city=Chennai&min_price=1000000&bedrooms=2
    const filters = {
      city: req.query.city,
      min_price: req.query.min_price,
      max_price: req.query.max_price,
      property_type: req.query.property_type,
      bedrooms: req.query.bedrooms,
      sort_by: req.query.sort_by,
      sort_order: req.query.sort_order,
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };

    const result = await propertyService.getAllProperties(filters);

    res.status(200).json({
      success: true,
      data: result.properties,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get Single Property ────────────────────────────
const getPropertyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await propertyService.getPropertyById(id);

    // Get similar properties too
    const similar = await propertyService.getSimilarProperties(id);

    res.status(200).json({
      success: true,
      data: {
        property,
        similarProperties: similar,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Update Property ────────────────────────────────
const updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await propertyService.updateProperty(
      id,
      req.user.userId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: property,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Delete Property ────────────────────────────────
const deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await propertyService.deleteProperty(id, req.user.userId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get Similar Properties ─────────────────────────
const getSimilarProperties = async (req, res, next) => {
  try {
    const { id } = req.params;
    const similar = await propertyService.getSimilarProperties(id);

    res.status(200).json({
      success: true,
      data: similar,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getSimilarProperties,
};
