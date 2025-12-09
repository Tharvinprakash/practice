const express = require('express')
const app = express();
const dotenv = require('dotenv')
const path = require('path')

const authRoutes = require("./src/route/authRoutes")
const userRoutes = require("./src/route/userRoutes")
const categoryRoutes = require("./src/route/categoryRoutes")
const productRoutes = require("./src/route/productRoutes")
const taxRoutes = require('./src/route/taxRoutes')
const paymentRoutes = require('./src/route/paymentRoutes')
const orderRoutes = require('./src/route/OrderRoutes')
const stripeRoutes = require('./src/route/stripeRoutes');
const unitRoutes = require('./src/route/unitRoutes');
const supplierRoutes = require('./src/route/supplierRoutes');
const inventoryRoutes = require('./src/route/inventoryRoutes');
const stockRoutes = require('./src/route/stockRoutes');
const dashboardRoutes = require('./src/route/dashboardRoutes');
const brandRoutes = require('./src/route/brandRoutes');
const quotationRoutes = require('./src/route/quotationRoutes');

const { json } = require('stream/consumers');

const PORT = 3000;
dotenv.config();

app.use("/stripe-payment/webhook",express.raw({type: "application/json"}))
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
app.use("/order",orderRoutes);

app.use("/stripe-payment",stripeRoutes);
app.use("/unit",unitRoutes);
app.use("/supplier",supplierRoutes);
app.use("/inventory",inventoryRoutes);

app.use("/stock",stockRoutes);

app.use("/dashboard",dashboardRoutes);
app.use("/brand",brandRoutes);

app.use("/quotation",quotationRoutes);

app.listen(PORT, () => console.log(`App is running on ${PORT}`));







