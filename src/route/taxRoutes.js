const express = require('express')

const route = express.Router();

const taxController = require('../controller/taxController');
const { verifyToken,permissionCheck } = require("../middleware/middleware");


route.post("/create",verifyToken,(req,res,next) => permissionCheck(req, res, next, "admin.create"),taxController.create);
route.get("/",verifyToken,taxController.getTaxes);
route.get("/:id",verifyToken,taxController.getTaxById);
route.put("/update",verifyToken,(req,res,next) => permissionCheck(req, res, next, "admin.create"),taxController.update);
route.delete("/:id",verifyToken,(req,res,next) => permissionCheck(req, res, next, "admin.delete"),taxController.delete);


module.exports = route