const express = require('express')

const route = express.Router();

const taxController = require('../controller/taxController');

route.post("/create",taxController.create);
route.get("/",taxController.getTaxes);
route.get("/:id",taxController.getTaxById);
route.put("/update",taxController.update);
route.delete("/:id",taxController.delete);


module.exports = route