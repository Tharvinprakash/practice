const express = require('express')

const route = express.Router();

const stripeController = require('../controller/stripeController');
const webhookController = require('../controller/webHookController');

route.post("/create-payment",stripeController.createCheckoutSession);

route.post("/webhook", webhookController.stripeWebHooks);
route.get("/checkStripe",webhookController.CheckStripe)
route.get("/payment-success",webhookController.getPaymentSuccess);
route.get("/payment-failed",webhookController.getPaymentFail);

module.exports=route;