const express = require('express')

const route = express.Router();

const categoryController = require("../controller/categoryController");
const { verifyToken,permissionCheck } = require("../middleware/middleware");

route.use(express.json());

route.post("/add", verifyToken,(req,res,next) => permissionCheck(req, res, next, "admin.create"),categoryController.addCategory);
route.get("/",verifyToken, categoryController.getCategory);
route.get("/:id",verifyToken,categoryController.getCategoryById);
route.put("/update/:id", verifyToken,(req,res,next) => permissionCheck(req, res, next, "admin.create"),categoryController.updateCategory);
route.delete("/delete/:id",verifyToken,(req,res,next) => permissionCheck(req, res, next, "admin.delete"),categoryController.deleteById);

route.get("/search/:name",verifyToken, categoryController.searchCategory);
route.get("/sort/:asc",verifyToken,categoryController.sortByCategoryName);


module.exports = route;

// route.post('/createAdmin', verifyToken, 
//     (req, res, next) => permissionCheck(req, res, next, "admin.create"),
//     authController.register);

