const express = require('express')

const route = express.Router();

const supplierController = require("../controller/supplierController");
const { verifyToken,permissionCheck } = require("../middleware/middleware");


route.post("/add",verifyToken,(req,res,next) => permissionCheck(req, res, next, "admin.create"), supplierController.addSupplier);
route.get("/",verifyToken, supplierController.getSupplier);
route.get("/:id",verifyToken,supplierController.getSupplierById);
route.put("/update/:id",verifyToken,(req,res,next) => permissionCheck(req, res, next, "admin.create"), supplierController.updateSupplier);
route.delete("/delete/:id",(req,res,next) => permissionCheck(req, res, next, "admin.delete"),verifyToken,supplierController.deleteById);

module.exports=route;
