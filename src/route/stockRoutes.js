const express = require('express')

const route = express.Router();

const stockController = require('../controller/stockController');


route.get("/low-stock",stockController.getLowStocks);

module.exports=route;