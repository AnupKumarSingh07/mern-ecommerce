const crypto = require("crypto");
const Razorpay = require("razorpay");

const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

// =====================================================
// CREATE RAZORPAY ORDER
// =====================================================

const createOrder = async (
  req,
  res
) => {
  try {
    const userId =
      req.user.id;

    const {
      cartItems,
      addressInfo,
      cartId,
    } = req.body;

    if (
      !Array.isArray(cartItems) ||
      cartItems.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cart items are required.",
      });
    }

    if (!addressInfo?.address) {
      return res.status(400).json({
        success: false,
        message:
          "Delivery address is required.",
      });
    }

    // =================================================
    // VERIFY PRODUCTS + CALCULATE REAL TOTAL
    // =================================================

    const verifiedCartItems = [];

    let calculatedTotal = 0;

    for (const item of cartItems) {
      if (!item?.productId) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid product in cart.",
        });
      }

      const product =
        await Product.findById(
          item.productId
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "One of the products no longer exists.",
        });
      }

      const quantity =
        Number(item.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid product quantity.",
        });
      }

      // ===============================================
      // VARIANT
      // ===============================================

      let selectedVariant = null;

      if (
        item.variantId &&
        product.variants?.length
      ) {
        selectedVariant =
          product.variants.find(
            (variant) =>
              variant._id.toString() ===
              item.variantId.toString()
          );

        if (!selectedVariant) {
          return res.status(400).json({
            success: false,
            message:
              `Selected variant for ${product.title} was not found.`,
          });
        }
      }

      // ===============================================
      // PRICE
      // ===============================================

      const regularPrice =
        selectedVariant
          ? Number(
              selectedVariant.price
            )
          : Number(product.price);

      const salePrice =
        selectedVariant
          ? Number(
              selectedVariant.salePrice || 0
            )
          : Number(
              product.salePrice || 0
            );

      const finalPrice =
        salePrice > 0
          ? salePrice
          : regularPrice;

      // ===============================================
      // STOCK
      // ===============================================

      const availableStock =
        selectedVariant
          ? Number(
              selectedVariant.stock
            )
          : Number(
              product.totalStock
            );

      if (
        availableStock < quantity
      ) {
        return res.status(400).json({
          success: false,
          message:
            `${product.title} does not have enough stock.`,
        });
      }

      const itemTotal =
        finalPrice * quantity;

      calculatedTotal += itemTotal;

      verifiedCartItems.push({
        productId:
          product._id.toString(),

        title:
          product.title,

        image:
          product.image,

        price:
          finalPrice,

        quantity,

        color:
          selectedVariant?.color ||
          "",

        size:
          selectedVariant?.size ||
          "",

        variantId:
          selectedVariant?._id
            ? selectedVariant._id.toString()
            : "",
      });
    }

    calculatedTotal =
      Math.round(
        calculatedTotal * 100
      ) / 100;

    if (calculatedTotal <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order amount.",
      });
    }

    // =================================================
    // RAZORPAY
    // =================================================

    const razorpay =
      new Razorpay({
        key_id:
          process.env.RAZORPAY_KEY_ID,

        key_secret:
          process.env.RAZORPAY_KEY_SECRET,
      });

    const amountInPaise =
      Math.round(
        calculatedTotal * 100
      );

    const razorpayOrder =
      await razorpay.orders.create({
        amount:
          amountInPaise,

        currency: "INR",

        receipt:
          `rcpt_${Date.now()}`,
      });

    if (!razorpayOrder?.id) {
      return res.status(500).json({
        success: false,
        message:
          "Failed to generate Razorpay order.",
      });
    }

    // =================================================
    // SAVE ORDER
    // =================================================

    const newlyCreatedOrder =
      new Order({
        userId,

        userName:
          req.user.userName || "",

        cartId:
          cartId || "",

        cartItems:
          verifiedCartItems,

        addressInfo: {
          addressId:
            addressInfo.addressId ||
            "",

          address:
            addressInfo.address ||
            "",

          city:
            addressInfo.city ||
            "",

          pincode:
            addressInfo.pincode ||
            "",

          phone:
            addressInfo.phone ||
            "",

          notes:
            addressInfo.notes ||
            "",
        },

        orderStatus:
          "pending",

        paymentMethod:
          "razorpay",

        paymentStatus:
          "pending",

        totalAmount:
          calculatedTotal,

        paymentId: "",

        payerId: "",

        razorpayOrderId:
          razorpayOrder.id,
      });

    await newlyCreatedOrder.save();

    return res.status(201).json({
      success: true,

      orderId:
        newlyCreatedOrder._id,

      razorpayOrderId:
        razorpayOrder.id,

      amount:
        razorpayOrder.amount,

      currency:
        razorpayOrder.currency,
    });
  } catch (error) {
    console.error(
      "CREATE RAZORPAY ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create Razorpay order.",
    });
  }
};

// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================

const capturePayment = async (
  req,
  res
) => {
  try {
    const userId =
      req.user.id;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing payment verification parameters.",
      });
    }

    const body =
      `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(body)
        .digest("hex");

    if (
      expectedSignature !==
      razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment verification failed.",
      });
    }

    const order =
      await Order.findById(
        orderId
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found.",
      });
    }

    // User can only capture their own order
    if (
      order.userId.toString() !==
      userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to update this order.",
      });
    }

    // Make sure Razorpay order matches
    if (
      order.razorpayOrderId !==
      razorpay_order_id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Razorpay order mismatch.",
      });
    }

    if (
      order.paymentStatus ===
      "paid"
    ) {
      return res.status(200).json({
        success: true,
        message:
          "Payment already captured.",
        data: order,
      });
    }

    // =================================================
    // UPDATE PAYMENT
    // =================================================

    order.paymentStatus =
      "paid";

    order.orderStatus =
      "confirmed";

    order.paymentId =
      razorpay_payment_id;

    order.orderUpdateDate =
      new Date();

    // =================================================
    // REDUCE STOCK
    // =================================================

    for (const item of order.cartItems) {
      const product =
        await Product.findById(
          item.productId
        );

      if (!product) {
        continue;
      }

      const itemQty =
        Number(item.quantity) || 1;

      if (
        item.variantId &&
        product.variants?.length
      ) {
        const variant =
          product.variants.find(
            (v) =>
              v._id.toString() ===
              item.variantId.toString()
          );

        if (variant) {
          variant.stock =
            Math.max(
              0,
              Number(
                variant.stock
              ) - itemQty
            );
        }
      } else {
        product.totalStock =
          Math.max(
            0,
            Number(
              product.totalStock
            ) - itemQty
          );
      }

      await product.save();
    }

    // =================================================
    // DELETE CART
    // =================================================

    if (order.cartId) {
      await Cart.findByIdAndDelete(
        order.cartId
      );
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message:
        "Payment verified and order confirmed successfully.",
      data: order,
    });
  } catch (error) {
    console.error(
      "CAPTURE PAYMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Payment verification error.",
    });
  }
};

// =====================================================
// USER ORDERS
// =====================================================

const getAllOrdersByUser = async (
  req,
  res
) => {
  try {
    const {
      userId,
    } = req.params;

    if (
      userId.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to view these orders.",
      });
    }

    const orders =
      await Order.find({
        userId,
      }).sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(
      "GET USER ORDERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Error fetching orders.",
    });
  }
};

// =====================================================
// USER ORDER DETAILS
// =====================================================

const getOrderDetails = async (
  req,
  res
) => {
  try {
    const {
      id,
    } = req.params;

    const order =
      await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found!",
      });
    }

    if (
      order.userId.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to view this order.",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(
      "GET ORDER DETAILS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Error fetching order details.",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};