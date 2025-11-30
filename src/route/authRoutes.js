const express = require('express');

const route = express.Router();

const authController = require('../controller/authController');

route.use(express.json());

route.post('/register', authController.register);
route.post('/login',authController.login);

route.get("/google",authController.googleLogin);
route.get("/google/callback",authController.googleCallback);


route.post("/forgotpassword",authController.forgotpassword);
route.post("/verify",authController.verify);
route.post("/resetpassword",authController.resetpassword);



module.exports = route;