const express = require('express');

const route = express.Router();

const orderController = require("../controller/orderController");

route.post("/create",orderController.create)



module.exports = route;