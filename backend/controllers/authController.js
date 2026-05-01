import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// ✅ REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 🔹 validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // 🔹 check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // 🔹 hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "member", // default role
    });

    res.status(201).json({
      msg: "User registered successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};



// ✅ LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔹 validation
    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // 🔹 check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // 🔹 compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // 🔹 create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔹 response
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};