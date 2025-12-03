const express = require('express')

const route = express.Router();

const categoryController = require("../controller/categoryController");
const { verifyToken } = require("../middleware/middleware");

route.use(express.json());

route.post("/add", categoryController.addCategory);
route.get("/", categoryController.getCategory);
route.get("/:id",categoryController.getCategoryById);
route.put("/update/:id", categoryController.updateCategory);
route.delete("/delete/:id",categoryController.deleteById);

route.get("/search/:name", categoryController.searchCategory);
route.get("/sort/:asc",categoryController.sortByCategoryName);


module.exports = route;


