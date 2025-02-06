import bcrypt from "bcrypt";
import jwtUtil from "../utils/jwt.util.js";
import UserModel from "../models/user.model.js";

export const register = async (req, res) => {
  const { email, first_name, last_name, password, password_confirmation } =
    req.body;

  if (password !== password_confirmation) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      email,
      first_name,
      last_name,
      password: hashedPassword,
    });
    await newUser.save();
    const api_token = jwtUtil.generateToken({
      id: newUser.id,
      email: newUser.email,
    });
    return res
      .status(200)
      .json({ message: "User registered successfully.", api_token, newUser });
  } catch (error) {
    return res.status(500).json({ message: "Server error.", error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const api_token = jwtUtil.generateToken({ id: user.id, email: user.email });
    return res.status(200).json({ api_token, user });
  } catch (error) {
    return res.status(500).json({ message: "Server error.", error });
  }
};

export const requestPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ result: false, message: "Email not found." });
    }

    return res
      .status(200)
      .json({ result: true, message: "Reset instructions sent." });
  } catch (error) {
    return res.status(500).json({ message: "Server error.", error });
  }
};

export const verifyToken = async (req, res) => {
  const { api_token } = req.body;

  // console.log("decoded token", req.body);
  try {
    const decoded = jwtUtil.verifyToken(api_token);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server error.", error });
  }
};
