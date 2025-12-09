const express = require('express')
const route = express.Router();

const brandController = require("../controller/brandController");

route.post("/create",brandController.create);
route.get("/",brandController.getBrands);
route.get("/:id",brandController.getBrandById);
route.put("/update/:id",brandController.update);
route.delete("/delete/:id",brandController.delete);


module.exports=route;