const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} = require("../../controllers/common/feature-controller");

const {
  authMiddleware,
} = require("../../controllers/auth/auth-controller");

const adminMiddleware = require("../../middlewares/admin-middleware");

const router = express.Router();

// Public
router.get(
  "/get",
  getFeatureImages
);

// Admin only
router.post(
  "/add",
  authMiddleware,
  adminMiddleware,
  addFeatureImage
);

router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  deleteFeatureImage
);

module.exports = router;