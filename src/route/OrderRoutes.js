const express = require('express');

const route = express.Router();

const orderController = require("../controller/orderController");

const { verifyToken } = require('../middleware/middleware');


route.post("/create",verifyToken,orderController.create)


module.exports = route;
