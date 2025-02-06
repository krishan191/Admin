import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { fileURLToPath } from "url"; // Import fileURLToPath
import { dirname, join } from "path"; // Import dirname and join
import connectDB from "./config/connectDB.js";
import userRouter from "./routes/auth.routes.js";
import customerRoutes from "./routes/customer.routes.js";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);
console.log("dirname", __dirname);

// dotenv config
dotenv.config();

// express object
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get("/", (request, response) => {
  response.json({
    message: "Server is running on port " + PORT,
  });
});

app.use("/api", userRouter);
app.use("/api/users", customerRoutes);

// Serve React Static Files
const staticPath = join(__dirname, "/client/dist");
console.log("Serving static files from:", staticPath);
app.use(express.static(staticPath));

console.log(join(staticPath, "index.html"));

// Render client for any path
app.get("*", (req, res) => {
  res.sendFile(join(staticPath, "index.html"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
  });
});
