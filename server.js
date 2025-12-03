const express = require('express')
const app = express();
const dontenv = require('dotenv')
const path = require('path')

const authRoutes = require("./src/route/authRoutes")
const userRoutes = require("./src/route/userRoutes")
const categoryRoutes = require("./src/route/categoryRoutes")
const productRoutes = require("./src/route/productRoutes")
const taxRoutes = require('./src/route/taxRoutes')
const paymentRoutes = require('./src/route/paymentRoutes')

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

app.use("/tax",taxRoutes)
app.use("/payment",paymentRoutes)

app.listen(PORT, () => console.log(`App is running on ${PORT}`));



// Read documentation about knex-paginate and implemented pagination for both products and categories with limit
// Implemented sorting ascending and descending on both products and categories
// created order,order items,tax,payment mode tables on migration
// seeded the data for tax & payments
// create crud operations on both tax & payment mode


// Reviewed and applied the knex-paginate documentation to implement pagination with dynamic limit support for both products and categories.

// Added sorting functionality for both ascending and descending order on products and categories.

// Created migration files for orders, order items, tax, and payment mode tables.

// Seeded initial data for tax and payment modes.

// Implemented complete CRUD operations for both tax and payment mode modules.





