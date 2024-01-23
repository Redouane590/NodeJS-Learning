const express = require("express");
const app = express();
const cors = require("cors");
const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();

connectDB()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/images", express.static("images"));

module.exports = app;
