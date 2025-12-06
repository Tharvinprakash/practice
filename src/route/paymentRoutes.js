const express = require('express')

const route = express.Router();

const paymentController = require('../controller/paymentController');
const { verifyToken,permissionCheck } = require("../middleware/middleware");


route.post("/create",verifyToken,(req,res,next) => permissionCheck(req, res, next, "admin.create"),paymentController.create);
route.get("/",verifyToken,paymentController.getPayments);
route.get("/:id",verifyToken,paymentController.getPaymentById);
route.put("/update",verifyToken,(req,res,next) => permissionCheck(req, res, next, "admin.create"),paymentController.update);
route.delete("/:id",(req,res,next) => permissionCheck(req, res, next, "admin.delete"),paymentController.delete);


module.exports = route