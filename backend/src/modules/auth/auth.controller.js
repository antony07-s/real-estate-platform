const authService = require("./auth.service");
const Joi = require("joi");

// ─── Validation Schemas ─────────────────────────────
// Joi validates incoming data before it reaches service
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().min(10).max(15).optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// ─── Register ───────────────────────────────────────
const register = async (req, res, next) => {
  try {
    // 1. Validate request body
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    // 2. Call service
    const result = await authService.register(value);

    // 3. Send response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (err) {
    next(err); // sends to errorHandler middleware
  }
};

// ─── Login ──────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    // 1. Validate request body
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    // 2. Call service
    const result = await authService.login(value);

    // 3. Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Refresh Token ──────────────────────────────────
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: "Refresh token is required",
      });
    }

    const result = await authService.refreshToken(refreshToken);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get Current User ───────────────────────────────
const getMe = async (req, res, next) => {
  try {
    // req.user is set by auth middleware
    res.status(200).json({
      success: true,
      data: { user: req.user },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refreshToken, getMe };
