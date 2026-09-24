const mongoose = require("mongoose");

const OrderSchema =
  new mongoose.Schema(
    {
      userId: {
        type: String,
        required: true,
      },

      // Stored so admin doesn't have to depend
      // on the currently logged-in user's name.
      userName: {
        type: String,
        default: "",
      },

      cartId: {
        type: String,
        default: "",
      },

      cartItems: [
        {
          productId: {
            type: String,
            required: true,
          },

          title: {
            type: String,
            default: "",
          },

          image: {
            type: String,
            default: "",
          },

          price: {
            type: Number,
            required: true,
            min: 0,
          },

          quantity: {
            type: Number,
            required: true,
            min: 1,
          },

          color: {
            type: String,
            default: "",
          },

          size: {
            type: String,
            default: "",
          },

          variantId: {
            type: String,
            default: "",
          },
        },
      ],

      addressInfo: {
        addressId: {
          type: String,
          default: "",
        },

        address: {
          type: String,
          default: "",
        },

        city: {
          type: String,
          default: "",
        },

        pincode: {
          type: String,
          default: "",
        },

        phone: {
          type: String,
          default: "",
        },

        notes: {
          type: String,
          default: "",
        },
      },

      orderStatus: {
        type: String,
        enum: [
          "pending",
          "confirmed",
          "inProcess",
          "inShipping",
          "delivered",
          "rejected",
        ],
        default: "pending",
      },

      paymentMethod: {
        type: String,
        default: "razorpay",
      },

      paymentStatus: {
        type: String,
        enum: [
          "pending",
          "paid",
          "failed",
        ],
        default: "pending",
      },

      totalAmount: {
        type: Number,
        required: true,
        min: 0,
      },

      orderDate: {
        type: Date,
        default: Date.now,
      },

      orderUpdateDate: {
        type: Date,
        default: Date.now,
      },

      paymentId: {
        type: String,
        default: "",
      },

      payerId: {
        type: String,
        default: "",
      },

      razorpayOrderId: {
        type: String,
        default: "",
      },
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Order",
    OrderSchema
  );