import jwtUtil from "../utils/jwt.util.js";

export const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization token missing." });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwtUtil.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }

  req.user = decoded;
  next();
};
