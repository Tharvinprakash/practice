const express = require('express')

const route = express.Router();

const stockController = require('../controller/stockController');


route.post("/create",stockController.create);
route.get("/low-stock",stockController.getLowStocks);
route.get("/",stockController.getStocks);
route.get("/:id",stockController.getStockById);
route.put("/update/:id",stockController.update);
route.delete("/delete/:id",stockController.delete);

module.exports=route;