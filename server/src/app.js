// app.js

const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const connectDb = require("./config/database");
const initializeSocket = require("./utils/socket");

// Routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const razorpayRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Update this later with your frontend deployment URL
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Root Route for Render
app.get("/", (req, res) => {
  res.send("🚀 DevTinder backend is running successfully!");
});

// Routers
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", razorpayRouter);
app.use("/", chatRouter);

// Create HTTP server
const server = http.createServer(app);
initializeSocket(server);

// Connect to DB and start server
connectDb()
  .then(() => {
    console.log("✅ Database connection successful...");
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, "0.0.0.0", () => {
      console.log("🚀 Server is running on port:", PORT);
    });
  })
  .catch((err) => {
    console.log("❌ Database connection failed", err);
  });
