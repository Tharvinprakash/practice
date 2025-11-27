const express = require('express')
const app = express();
const dontenv = require('dotenv')
const authRoutes = require("./src/route/userRoutes")
const PORT = 3000;
dontenv.config();

app.use("/auth", authRoutes);
app.listen(PORT, () => console.log(`App is running on ${PORT}`));




