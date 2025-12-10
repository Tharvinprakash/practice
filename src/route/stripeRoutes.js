const express = require('express')

const route = express.Router();

const stripeController = require('../controller/stripeController');

route.get("/payment-success",stripeController.getPaymentSuccess);
route.get("/payment-failed",stripeController.getPaymentFail);

module.exports=route;