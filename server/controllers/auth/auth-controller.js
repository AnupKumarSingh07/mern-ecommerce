const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// =====================================================
// REGISTER
// =====================================================

const registerUser = async (req, res) => {
  try {
    const {
      userName,
      email,
      password,
    } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Username, email and password are required.",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const checkUser = await User.findOne({
      email: normalizedEmail,
    });

    if (checkUser) {
      return res.status(409).json({
        success: false,
        message:
          "User already exists with the same email.",
      });
    }

    const hashPassword = await bcrypt.hash(
      password,
      12
    );

    const newUser = new User({
      userName: userName.trim(),
      email: normalizedEmail,
      password: hashPassword,

      // NEVER accept role from frontend registration
      role: "user",
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Registration failed.",
    });
  }
};

// =====================================================
// LOGIN
// =====================================================

const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const checkUser = await User.findOne({
      email: normalizedEmail,
    });

    if (!checkUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const checkPasswordMatch =
      await bcrypt.compare(
        password,
        checkUser.password
      );

    if (!checkPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const token = jwt.sign(
      {
        id: checkUser._id.toString(),
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "60m",
      }
    );

    res
      .cookie("token", token, {
        httpOnly: true,

        secure:
          process.env.NODE_ENV === "production",

        sameSite:
          process.env.NODE_ENV === "production"
            ? "none"
            : "lax",

        maxAge:
          60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Logged in successfully",

        user: {
          email: checkUser.email,
          role: checkUser.role,
          id: checkUser._id.toString(),
          userName: checkUser.userName,
        },
      });
  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
};

// =====================================================
// LOGOUT
// =====================================================

const logoutUser = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,

      secure:
        process.env.NODE_ENV === "production",

      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
    })
    .status(200)
    .json({
      success: true,
      message: "Logged out successfully!",
    });
};

// =====================================================
// AUTH MIDDLEWARE
// =====================================================

const authMiddleware = async (
  req,
  res,
  next
) => {
  try {
    const token =
      req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorised user!",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    console.error(
      "AUTH MIDDLEWARE ERROR:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message:
        "Session expired. Please login again.",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
};