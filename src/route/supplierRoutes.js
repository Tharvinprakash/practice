const express = require('express')

const route = express.Router();

const supplierController = require("../controller/supplierController");

route.post("/add", supplierController.addSupplier);
route.get("/", supplierController.getSupplier);
route.get("/:id",supplierController.getSupplierById);
route.put("/update/:id", supplierController.updateSupplier);
route.delete("/delete/:id",supplierController.deleteById);

module.exports=route;
