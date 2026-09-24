const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

// ==========================================
// UPLOAD PRODUCT IMAGE
// ==========================================
const handleImageUpload = async (req, res) => {
  try {
    console.log("📸 Uploaded file:", req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

    const result = await imageUploadUtil(req.file);

    console.log("☁️ Cloudinary result:", result);

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("❌ Upload Image Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// ADD NEW PRODUCT
// ==========================================
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
      variants,
    } = req.body;

    // -----------------------------
    // Validate required fields
    // -----------------------------
    if (
      !image ||
      !title ||
      !description ||
      !category ||
      !brand ||
      price === undefined ||
      totalStock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Required product fields are missing",
      });
    }

    // -----------------------------
    // Clean variants
    // -----------------------------
    const cleanedVariants = Array.isArray(variants)
      ? variants
          .filter(
            (variant) =>
              variant &&
              (variant.color || variant.size)
          )
          .map((variant) => ({
            color: String(variant.color || "").trim(),
            size: String(variant.size || "").trim(),
            price: Number(variant.price || 0),
            salePrice: Number(variant.salePrice || 0),
            stock: Number(variant.stock || 0),
          }))
      : [];

    // -----------------------------
    // Create product
    // -----------------------------
    const newlyCreatedProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price: Number(price),
      salePrice: Number(salePrice || 0),
      totalStock: Number(totalStock),
      averageReview: Number(averageReview || 0),
      variants: cleanedVariants,
    });

    await newlyCreatedProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: newlyCreatedProduct,
    });
  } catch (error) {
    console.error("❌ ADD PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// FETCH ALL PRODUCTS
// ==========================================
const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("❌ FETCH PRODUCTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// EDIT PRODUCT
// ==========================================
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
      variants,
    } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // -----------------------------
    // Update normal fields
    // -----------------------------
    if (image !== undefined) {
      product.image = image;
    }

    if (title !== undefined) {
      product.title = title;
    }

    if (description !== undefined) {
      product.description = description;
    }

    if (category !== undefined) {
      product.category = category;
    }

    if (brand !== undefined) {
      product.brand = brand;
    }

    if (price !== undefined) {
      product.price = Number(price);
    }

    if (salePrice !== undefined) {
      product.salePrice = Number(salePrice || 0);
    }

    if (totalStock !== undefined) {
      product.totalStock = Number(totalStock);
    }

    if (averageReview !== undefined) {
      product.averageReview = Number(averageReview || 0);
    }

    // -----------------------------
    // Update variants
    // -----------------------------
    if (Array.isArray(variants)) {
      product.variants = variants
        .filter(
          (variant) =>
            variant &&
            (variant.color || variant.size)
        )
        .map((variant) => ({
          color: String(variant.color || "").trim(),
          size: String(variant.size || "").trim(),
          price: Number(variant.price || 0),
          salePrice: Number(variant.salePrice || 0),
          stock: Number(variant.stock || 0),
        }));
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("❌ EDIT PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// DELETE PRODUCT
// ==========================================
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("❌ DELETE PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};