const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes= require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

app.use(express.json());  // This middleware parses incoming JSON requests
app.use(cookieParser());  // This middleware parses cookies



app.use(
    cors({
      origin: ["http://localhost:5173"],
      credentials: true,
    })
  );

  app.get("/", (req, res) => {
    res.send("Welcome to IndustriAi");
  });

mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));  


app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});