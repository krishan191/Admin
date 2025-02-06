import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  deleteSelectedCustomers,
} from "../controllers/customer.controller.js";

// Initialize the router
const router = express.Router();

// To get the __dirname equivalent in ES module
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up the 'uploads' directory
const uploadDir = path.join(__dirname, "../uploads"); // Adjusted to make sure the path works from the current module
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadMiddleware = multer({ storage });

// Customer Routes
router.get("/query", getCustomers); // Fetch all customers with query params
router.get("/:id", getCustomerById); // Fetch a single customer by ID
router.post("/create", uploadMiddleware.single("avatar"), createCustomer); // Create customer (single file upload)
router.put("/update/:id", uploadMiddleware.single("avatar"), updateCustomer); // Update customer (single file upload)
router.delete("/delete/:id", deleteCustomer); // Delete single customer
router.delete("/delete", deleteSelectedCustomers); // Delete multiple customers

export default router;
