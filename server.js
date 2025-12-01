const express = require('express')
const app = express();
const dontenv = require('dotenv')

const authRoutes = require("./src/route/authRoutes")
const userRoutes = require("./src/route/userRoutes")
const categoryRoutes = require("./src/route/categoryRoutes")

const PORT = 3000;
dontenv.config();

app.use(express.json());


app.use("/auth", authRoutes);

app.use("/admin", userRoutes);
app.use("/staff",userRoutes);
app.use("/customer",userRoutes);

app.use("/category",categoryRoutes);

app.listen(PORT, () => console.log(`App is running on ${PORT}`));








