const express = require('express')

const route = express.Router();

const quotationController = require("../controller/quotationController");

route.post("/create",quotationController.create)
route.get("/",quotationController.getQuotation)
route.get("/:id",quotationController.getQuotationById)
route.put("/update/:id",quotationController.update)
route.delete("/delete/:id",quotationController.delete)

module.exports=route;