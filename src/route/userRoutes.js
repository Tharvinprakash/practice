const express = require('express');

const route = express.Router();

const authController = require("../controller/authController");
const userController = require('../controller/userController');

route.use(express.json());


const { permissionCheck, verifyToken } = require('../middleware/middleware');

route.post('/createAdmin', verifyToken,
        (req, res, next) => permissionCheck(req, res, next, "admin.create"),
        authController.register);

route.post("/createStaff", verifyToken,
        (req, res, next) => permissionCheck(req, res, next, "staff.create"),
        authController.register);

route.post('/createCustomer', verifyToken,
        (req, res, next) => permissionCheck(req, res, next, "customer.create"),
        authController.register);

route.delete('/deleteAdmin/:id', verifyToken,
        (req, res, next) => permissionCheck(req, res, next, "admin.delete"),
        userController.delete);

route.delete("/deleteStaff/:id", verifyToken,
        (req, res, next) => permissionCheck(req, res, next, "staff.delete"),
        userController.delete);
        
route.delete('/deleteCustomer/:id', verifyToken,
        (req, res, next) => permissionCheck(req, res, next, "customer.delete"),
        userController.delete);


module.exports = route;






