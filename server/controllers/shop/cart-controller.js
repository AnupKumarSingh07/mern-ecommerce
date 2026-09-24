const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

// =====================================================
// HELPER: GET SELECTED VARIANT
// =====================================================

const getSelectedVariant = (product, variantId) => {
  if (!variantId) {
    return null;
  }

  if (!product.variants || product.variants.length === 0) {
    return null;
  }

  return product.variants.find(
    (variant) => variant._id.toString() === variantId.toString()
  );
};

// =====================================================
// HELPER: PREPARE CART ITEMS
// =====================================================

const prepareCartItems = (cart) => {
  return cart.items.map((item) => {
    const product = item.productId;

    if (!product) {
      return {
        productId: null,
        variantId: item.variantId || null,
        image: null,
        title: "Product not found",
        price: null,
        salePrice: null,
        color: null,
        size: null,
        stock: 0,
        quantity: item.quantity,
      };
    }

    let selectedVariant = null;

    if (item.variantId && product.variants?.length) {
      selectedVariant = product.variants.find(
        (variant) =>
          variant._id.toString() === item.variantId.toString()
      );
    }

    return {
      productId: product._id,

      variantId: selectedVariant
        ? selectedVariant._id
        : item.variantId || null,

      image: product.image,

      title: product.title,

      // Variant price if variant exists
      // Otherwise product price
      price: selectedVariant
        ? selectedVariant.price
        : product.price,

      salePrice: selectedVariant
        ? selectedVariant.salePrice
        : product.salePrice,

      // Variant information
      color: selectedVariant
        ? selectedVariant.color
        : null,

      size: selectedVariant
        ? selectedVariant.size
        : null,

      // Variant stock
      stock: selectedVariant
        ? selectedVariant.stock
        : product.totalStock,

      quantity: item.quantity,
    };
  });
};

// =====================================================
// ADD TO CART
// =====================================================

const addToCart = async (req, res) => {
  try {
    const {
      userId,
      productId,
      quantity,
      variantId,
    } = req.body;

    if (
      !userId ||
      !productId ||
      !quantity ||
      quantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // =================================================
    // GET SELECTED VARIANT
    // =================================================

    const selectedVariant = getSelectedVariant(
      product,
      variantId
    );

    // If product has variants, variant must be selected
    if (
      product.variants &&
      product.variants.length > 0 &&
      !variantId
    ) {
      return res.status(400).json({
        success: false,
        message: "Please select a product variant.",
      });
    }

    // Variant ID was provided but doesn't exist
    if (variantId && !selectedVariant) {
      return res.status(400).json({
        success: false,
        message: "Selected variant not found.",
      });
    }

    // =================================================
    // STOCK CHECK
    // =================================================

    const availableStock = selectedVariant
      ? selectedVariant.stock
      : product.totalStock;

    if (availableStock <= 0) {
      return res.status(400).json({
        success: false,
        message: "Selected variant is out of stock.",
      });
    }

    if (quantity > availableStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableStock} items available in stock.`,
      });
    }

    // =================================================
    // FIND USER CART
    // =================================================

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
      });
    }

    // =================================================
    // FIND SAME PRODUCT + SAME VARIANT
    // =================================================

    const findCurrentProductIndex =
      cart.items.findIndex((item) => {
        const sameProduct =
          item.productId.toString() === productId;

        const existingVariantId =
          item.variantId
            ? item.variantId.toString()
            : null;

        const currentVariantId =
          variantId
            ? variantId.toString()
            : null;

        const sameVariant =
          existingVariantId === currentVariantId;

        return sameProduct && sameVariant;
      });

    // =================================================
    // NEW CART ITEM
    // =================================================

    if (findCurrentProductIndex === -1) {
      cart.items.push({
        productId,
        variantId: variantId || null,
        quantity,
      });
    }

    // =================================================
    // EXISTING SAME VARIANT
    // =================================================

    else {
      const currentQuantity =
        cart.items[findCurrentProductIndex].quantity;

      const newQuantity =
        currentQuantity + quantity;

      if (newQuantity > availableStock) {
        return res.status(400).json({
          success: false,
          message: `Only ${availableStock} items available in stock.`,
        });
      }

      cart.items[findCurrentProductIndex].quantity =
        newQuantity;
    }

    await cart.save();

    // Populate product information
    await cart.populate({
      path: "items.productId",
      select:
        "image title price salePrice totalStock variants",
    });

    const populatedCartItems =
      prepareCartItems(cart);

    return res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populatedCartItems,
      },
    });
  } catch (error) {
    console.error("Add To Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error adding product to cart",
    });
  }
};

// =====================================================
// UPDATE CART ITEM QUANTITY
// =====================================================

const updateCartItemQty = async (req, res) => {
  try {
    const {
      userId,
      productId,
      quantity,
      variantId,
    } = req.body;

    if (
      !userId ||
      !productId ||
      !quantity ||
      quantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    const selectedVariant = getSelectedVariant(
      product,
      variantId
    );

    // Product has variants but no variant selected
    if (
      product.variants &&
      product.variants.length > 0 &&
      !variantId
    ) {
      return res.status(400).json({
        success: false,
        message: "Variant ID is required.",
      });
    }

    // Invalid variant
    if (variantId && !selectedVariant) {
      return res.status(400).json({
        success: false,
        message: "Selected variant not found.",
      });
    }

    const availableStock = selectedVariant
      ? selectedVariant.stock
      : product.totalStock;

    // =================================================
    // STOCK CHECK
    // =================================================

    if (quantity > availableStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableStock} items available in stock.`,
      });
    }

    // =================================================
    // FIND SAME PRODUCT + SAME VARIANT
    // =================================================

    const findCurrentProductIndex =
      cart.items.findIndex((item) => {
        const sameProduct =
          item.productId.toString() === productId;

        const existingVariantId =
          item.variantId
            ? item.variantId.toString()
            : null;

        const currentVariantId =
          variantId
            ? variantId.toString()
            : null;

        const sameVariant =
          existingVariantId === currentVariantId;

        return sameProduct && sameVariant;
      });

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present!",
      });
    }

    cart.items[findCurrentProductIndex].quantity =
      quantity;

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select:
        "image title price salePrice totalStock variants",
    });

    const populatedCartItems =
      prepareCartItems(cart);

    return res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populatedCartItems,
      },
    });
  } catch (error) {
    console.error("Update Cart Quantity Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error updating cart quantity",
    });
  }
};

// =====================================================
// FETCH CART ITEMS
// =====================================================

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(
      "Fetching cart for user:",
      userId
    );

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required!",
      });
    }

    const cart = await Cart.findOne({
      userId,
    }).populate({
      path: "items.productId",
      select:
        "image title price salePrice totalStock variants",
    });

    // =================================================
    // NO CART
    // =================================================

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          userId,
          items: [],
        },
      });
    }

    // =================================================
    // REMOVE PRODUCTS THAT NO LONGER EXIST
    // =================================================

    const validItems = cart.items.filter(
      (item) => item.productId !== null
    );

    if (
      validItems.length !==
      cart.items.length
    ) {
      cart.items = validItems;

      await cart.save();
    }

    // =================================================
    // PREPARE RESPONSE
    // =================================================

    const populatedCartItems =
      prepareCartItems({
        items: validItems,
      });

    return res.status(200).json({
      success: true,
      data: {
        _id: cart._id,
        userId: cart.userId,
        items: populatedCartItems,
      },
    });
  } catch (error) {
    console.error(
      "Fetch Cart Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =====================================================
// DELETE CART ITEM
// =====================================================

const deleteCartItem = async (req, res) => {
  try {
    const {
      userId,
      productId,
    } = req.params;

    const { variantId } = req.body || {};

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({
      userId,
    }).populate({
      path: "items.productId",
      select:
        "image title price salePrice totalStock variants",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    // =================================================
    // DELETE SAME PRODUCT + SAME VARIANT
    // =================================================

    cart.items = cart.items.filter(
      (item) => {
        const sameProduct =
          item.productId &&
          item.productId._id.toString() ===
            productId;

        const existingVariantId =
          item.variantId
            ? item.variantId.toString()
            : null;

        const currentVariantId =
          variantId
            ? variantId.toString()
            : null;

        const sameVariant =
          existingVariantId ===
          currentVariantId;

        return !(
          sameProduct &&
          sameVariant
        );
      }
    );

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select:
        "image title price salePrice totalStock variants",
    });

    const populatedCartItems =
      prepareCartItems(cart);

    return res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populatedCartItems,
      },
    });
  } catch (error) {
    console.error(
      "Delete Cart Item Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Error deleting cart item",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
};