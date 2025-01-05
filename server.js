const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes= require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
app.use(cors({credentials: true}));

app.use(express.json());  // This middleware parses incoming JSON requests
app.use(cookieParser());  // This middleware parses cookies




mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));  


app.use('/', authRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
