const Order = require("../../models/Order");
const User = require("../../models/User");

// =====================================================
// GET ALL ORDERS
// =====================================================

const getAllOrdersOfAllUsers = async (
  req,
  res
) => {
  try {
    const orders = await Order.find({})
      .sort({
        createdAt: -1,
      })
      .lean();

    // Empty orders are NOT an API error.
    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(
      "ADMIN GET ALL ORDERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch orders.",
    });
  }
};

// =====================================================
// GET SINGLE ORDER
// =====================================================

const getOrderDetailsForAdmin = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const order =
      await Order.findById(id).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    // Find customer information
    let customer = null;

    if (order.userId) {
      customer =
        await User.findById(
          order.userId
        )
          .select(
            "userName email"
          )
          .lean();
    }

    return res.status(200).json({
      success: true,
      data: {
        ...order,

        customerName:
          customer?.userName ||
          order.userName ||
          "Customer",

        customerEmail:
          customer?.email || "",
      },
    });
  } catch (error) {
    console.error(
      "ADMIN GET ORDER DETAILS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch order details.",
    });
  }
};

// =====================================================
// UPDATE ORDER STATUS
// =====================================================

const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "inProcess",
      "inShipping",
      "delivered",
      "rejected",
    ];

    if (
      !allowedStatuses.includes(
        orderStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order status.",
      });
    }

    const order =
      await Order.findByIdAndUpdate(
        id,
        {
          orderStatus,
          orderUpdateDate:
            new Date(),
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Order status updated successfully!",
      data: order,
    });
  } catch (error) {
    console.error(
      "ADMIN UPDATE ORDER STATUS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update order status.",
    });
  }
};

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
};