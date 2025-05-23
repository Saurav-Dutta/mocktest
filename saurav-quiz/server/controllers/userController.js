const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// ✅
exports.register = async (req, res) => {
  try {
    const { phone, username, password, confirmPassword, role } = req.body;

    if (!username || !phone || !password || !confirmPassword || !role) {
      return res
        .status(400)
        .json({ success: false, error: "Please fill all the fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Password and Confirm Password should be same",
      });
    }

    const phoneExists = await User.findOne({ phone });

    if (phoneExists) {
      return res
        .status(400)
        .json({ success: false, error: "Phone number is already registered, please log in" });
    }

    const usernameExists = await User.findOne({ username });

    if (usernameExists) {
      return res
        .status(400)
        .json({ success: false, error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      phone,
      password: hashedPassword,
      role,
    });

    return res
      .status(200)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.log("ERROR WHILE REGISTERING THE NEW USER:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};


exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Please fill all the fields" });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ success: false, error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    return res.cookie("token", token, options).status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        token,
        user: {
          id: user._id,
          phone: user.phone,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt,
          attemptedQuizzes: user?.attemptedQuizes || [],
        },
      },
    });
  } catch (error) {
    console.log("ERROR WHILE LOGGING IN THE USER:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};
