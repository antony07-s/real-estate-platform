const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../../config/db");

// ─── Helper: Generate Tokens ────────────────────────
const generateTokens = (userId, email) => {
  // Access token — short lived (15 mins)
  const accessToken = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // Refresh token — long lived (7 days)
  const refreshToken = jwt.sign(
    { userId, email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN },
  );

  return { accessToken, refreshToken };
};

// ─── Register ───────────────────────────────────────
const register = async ({ name, email, password, phone }) => {
  // 1. Check if email already exists
  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email],
  );

  if (existingUser.rows.length > 0) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  // 2. Hash password — never store plain text!
  // 10 = salt rounds (higher = more secure but slower)
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Insert user into database
  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, phone, created_at`,
    [name, email, hashedPassword, phone],
  );

  const user = result.rows[0];

  // 4. Generate tokens
  const tokens = generateTokens(user.id, user.email);

  return { user, ...tokens };
};

// ─── Login ──────────────────────────────────────────
const login = async ({ email, password }) => {
  // 1. Find user by email
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (result.rows.length === 0) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const user = result.rows[0];

  // 2. Compare password with hashed password
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // 3. Generate tokens
  const tokens = generateTokens(user.id, user.email);

  // 4. Return user without password
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, ...tokens };
};

// ─── Refresh Token ──────────────────────────────────
const refreshToken = async (token) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Generate new access token only
    const accessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    return { accessToken };
  } catch (err) {
    const error = new Error("Invalid refresh token");
    error.statusCode = 401;
    throw error;
  }
};

module.exports = { register, login, refreshToken };
