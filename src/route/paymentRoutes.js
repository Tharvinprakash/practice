const express = require('express')

const route = express.Router();

const paymentController = require('../controller/paymentController');

route.post("/create",paymentController.create);
route.get("/",paymentController.getPayments);
route.get("/:id",paymentController.getPaymentById);
route.put("/update",paymentController.update);
route.delete("/:id",paymentController.delete);


module.exports = route