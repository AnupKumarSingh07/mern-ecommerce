const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

// ===============================
// Upload Product Image
// ===============================
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

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("❌ Upload Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Add New Product
// ===============================
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
    } = req.body;

    console.log("Request Body:", req.body);

    const newlyCreatedProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    });

    console.log("Product Before Save:", newlyCreatedProduct);

    await newlyCreatedProduct.save();

    console.log("✅ Product Saved Successfully");

    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (error) {
    console.error("❌ Add Product Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Fetch All Products
// ===============================
const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});

    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (error) {
    console.error("❌ Fetch Products Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Edit Product
// ===============================
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
    } = req.body;

    const findProduct = await Product.findById(id);

    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    findProduct.title = title || findProduct.title;
    findProduct.description =
      description || findProduct.description;
    findProduct.category =
      category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;

    findProduct.price =
      price === "" ? 0 : price || findProduct.price;

    findProduct.salePrice =
      salePrice === ""
        ? 0
        : salePrice || findProduct.salePrice;

    findProduct.totalStock =
      totalStock || findProduct.totalStock;

    findProduct.image =
      image || findProduct.image;

    findProduct.averageReview =
      averageReview || findProduct.averageReview;

    await findProduct.save();

    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (error) {
    console.error("❌ Edit Product Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Delete Product
// ===============================
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete Product Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};