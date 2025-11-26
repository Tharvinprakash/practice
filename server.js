const express = require('express')
const app = express();
const authRoutes = require("./src/route/userRoutes")
const PORT = 3000;

app.use("/auth", authRoutes);
app.listen(PORT, () => console.log(`App is running on ${PORT}`));




