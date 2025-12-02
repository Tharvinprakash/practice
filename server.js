const express = require('express')
const app = express();
const dontenv = require('dotenv')
const path = require('path')

const authRoutes = require("./src/route/authRoutes")
const userRoutes = require("./src/route/userRoutes")
const categoryRoutes = require("./src/route/categoryRoutes")
const productRoutes = require("./src/route/productRoutes")

const PORT = 3000;
dontenv.config();

app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/auth", authRoutes);

app.use("/admin", userRoutes);
app.use("/staff", userRoutes);
app.use("/customer", userRoutes);

app.use("/category", categoryRoutes);
app.use("/product", productRoutes);

app.listen(PORT, () => console.log(`App is running on ${PORT}`));








