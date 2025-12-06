const express = require('express')

const route = express.Router();

const inventoryController = require("../controller/InventoryController");
const { verifyToken,permissionCheck } = require("../middleware/middleware");


route.post("/add",verifyToken,(req,res,next) => permissionCheck(req, res, next, "admin.create","staff.create"), inventoryController.addInventory);
route.get("/",verifyToken, inventoryController.getInventory);
route.get("/:id",verifyToken,inventoryController.getInventoryById);
route.put("/update/:id",verifyToken,(req,res,next) => permissionCheck(req, res, next, "admin.create","staff.create"), inventoryController.updateInventory);
route.delete("/delete/:id",verifyToken,(req,res,next) => permissionCheck(req, res, next, "admin.delete","staff.delete"),inventoryController.deleteById);


module.exports=route;
