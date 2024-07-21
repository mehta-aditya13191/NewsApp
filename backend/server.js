import express from "express";
import "dotenv/config";
import connectDB from "./config/database.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors";

//for separate controllers
// import authRoutes from "./routes/authRoutes.js";
// import uploadRoutes from "./routes/uploadRoutes.js"; // Import upload routes
// import blogRoutes from "./routes/blogRoutes.js"; // Import blog routes

const server = express();

//database connection
connectDB();

server.use(express.json());
server.use(cors());

server.use("/auth", authRoutes);

//for separate controllers
// server.use("/api/v1/auth", authRoutes);
// server.use("/api/v1/auth", uploadRoutes);
// server.use("/api/v1/auth", blogRoutes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(
    `server is running on  ${process.env.DEV_MODE} mode at port ${PORT}`.bgCyan
      .white
  );
});
