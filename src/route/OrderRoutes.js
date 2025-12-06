const express = require('express');

const route = express.Router();

const orderController = require("../controller/orderController");

const { verifyToken,permissionCheck } = require("../middleware/middleware");



route.post("/create",verifyToken,(req,res,next) => permissionCheck(req, res, next, "admin.create","staff.create"),orderController.create)


module.exports = route;
