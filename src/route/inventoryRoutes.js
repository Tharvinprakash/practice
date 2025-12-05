const express = require('express')

const route = express.Router();

const inventoryController = require("../controller/InventoryController");


route.post("/add", inventoryController.addInventory);
route.get("/", inventoryController.getInventory);
route.get("/:id",inventoryController.getInventoryById);
route.put("/update/:id", inventoryController.updateInventory);
route.delete("/delete/:id",inventoryController.deleteById);


module.exports=route;
