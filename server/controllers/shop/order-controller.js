const { client, checkoutNodeJssdk } = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

// ================= CREATE ORDER =================
const createOrder = async (req, res) => {
  try {
    console.log("===== CREATE ORDER CALLED =====");
    console.log(req.body);

    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();

    request.prefer("return=representation");

    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: Number(totalAmount).toFixed(2),

            breakdown: {
              item_total: {
                currency_code: "USD",
                value: cartItems
                  .reduce(
                    (sum, item) =>
                      sum +
                      Number(item.price) * Number(item.quantity),
                    0
                  )
                  .toFixed(2),
              },
            },
          },

          items: cartItems.map((item) => ({
            name: item.title,
            unit_amount: {
              currency_code: "USD",
              value: Number(item.price).toFixed(2),
            },
            quantity: Number(item.quantity).toString(),
          })),
        },
      ],


      application_context: {
        return_url: `${process.env.CLIENT_URL}/shop/paypal-return`,
        cancel_url: `${process.env.CLIENT_URL}/shop/paypal-cancel`,
        brand_name: "My E-Commerce Store",
        user_action: "PAY_NOW",
      },
    });

    const response = await client().execute(request);

    console.log("PAYPAL RESPONSE");
    console.dir(response.result, { depth: null });

    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
    });

    await newlyCreatedOrder.save();

    const approvalURL = response.result.links.find(
      (link) => link.rel === "approve"
    ).href;

    return res.status(201).json({
      success: true,
      approvalURL,
      orderId: newlyCreatedOrder._id,
    });
  } catch (e) {
    console.error("CREATE ORDER ERROR");
    console.error(e);

    return res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// ================= CAPTURE PAYMENT =================
const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order cannot be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      if (product.totalStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    await Cart.findByIdAndDelete(order.cartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.error(e);

    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// ================= USER ORDERS =================
const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.error(e);

    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// ================= ORDER DETAILS =================
const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.error(e);

    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};