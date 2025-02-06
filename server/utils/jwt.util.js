import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "fgdgdgfgkwrwerryttyhkjhkly323234";

const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch {
    return null;
  }
};

export default {
  generateToken,
  verifyToken,
};

