require("dotenv").config();

const requiredEnv = [
  "MONGO_URI",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const errorMiddleware = require("./middlewares/error-middleware");

const {
  authMiddleware,
} = require("./controllers/auth/auth-controller");

const adminMiddleware = require("./middlewares/admin-middleware");

const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

const app = express();

const PORT = process.env.PORT || 5000;

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://mern-ecommerce-client.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests such as Postman/server-to-server
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked origin: ${origin}`)
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
  })
);

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cookieParser());

app.use(
  express.json({
    limit: "10mb",
  })
);

// =====================================================
// PUBLIC AUTH ROUTES
// =====================================================

app.use("/api/auth", authRouter);

// =====================================================
// ADMIN ROUTES
// =====================================================

// Products are ADMIN ONLY
app.use(
  "/api/admin/products",
  authMiddleware,
  adminMiddleware,
  adminProductsRouter
);

// Orders are ADMIN ONLY
app.use(
  "/api/admin/orders",
  authMiddleware,
  adminMiddleware,
  adminOrderRouter
);

// =====================================================
// SHOP ROUTES
// =====================================================

app.use(
  "/api/shop/products",
  shopProductsRouter
);

app.use(
  "/api/shop/cart",
  shopCartRouter
);

app.use(
  "/api/shop/address",
  shopAddressRouter
);

// Order routes contain their own authentication
app.use(
  "/api/shop/order",
  shopOrderRouter
);

app.use(
  "/api/shop/search",
  shopSearchRouter
);

app.use(
  "/api/shop/review",
  shopReviewRouter
);

// =====================================================
// COMMON / FEATURE ROUTES
// =====================================================

app.use(
  "/api/common/feature",
  commonFeatureRouter
);

// =====================================================
// ERROR MIDDLEWARE
// =====================================================

app.use(errorMiddleware);

// =====================================================
// DATABASE + SERVER START
// =====================================================

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("====================================");
    console.log("MongoDB connected successfully");
    console.log(
      "MongoDB database:",
      mongoose.connection.name
    );
    console.log("====================================");
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error.message);
    throw error;
  }
};

// Local development
if (!process.env.VERCEL) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(
          `Server is now running on port ${PORT}`
        );
        console.log(
          `API: http://localhost:${PORT}`
        );
      });
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

// Vercel needs the Express app exported
module.exports = app;