const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { swaggerUi, swaggerSpec } = require("./utils/swagger");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./modules/auth/auth.routes");
const propertyRoutes = require("./modules/properties/property.routes");
const leadRoutes = require("./modules/leads/lead.routes");

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

//  Security Middlewares 
// helmet: adds security headers (protects from common attacks)
app.disable("x-powered-by");
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// cors: allows frontend (localhost:3000) to talk to backend (localhost:5000)
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

//  Rate Limiting 
// Prevents spam — max 100 requests per 15 minutes per IP
const isProduction = process.env.NODE_ENV === "production";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX) || (isProduction ? 100 : 1000),
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: "Too many requests, please try again later.",
      rateLimit: {
        limit: req.rateLimit.limit,
        remaining: req.rateLimit.remaining,
        resetTime: req.rateLimit.resetTime,
      },
    });
  },
});
app.use("/api", limiter);

//  Body Parser 
// Allows Express to read JSON from request body
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

//  Swagger Docs 
// API documentation available at /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//  Routes 
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/leads", leadRoutes);

//  Health Check 
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running!" });
});

//  Error Handler 
// Must be LAST — catches all errors from all routes
app.use(errorHandler);

module.exports = app;
