const express = require('express')
const route = express.Router();
const XLSX = require("xlsx");


const upload = require("../../util/multer")

const productController = require("../controller/productController")
const { verifyToken,permissionCheck } = require("../middleware/middleware");

route.post("/bulk-upload",upload.excelUpload.single("file"),productController.bulkUpload);
route.post("/upload", upload.upload.single("image"),productController.uploadCheck);
route.get("/export-products",productController.exportProducts);

// route.post('/uploadMultiple', upload.uploadMultiple.array("image",5),
// productController.uploadMultipleFileCheck);

route.post("/add",verifyToken,(req,res,next) => permissionCheck(req, res, next, "admin.create","staff.create"),productController.addProduct);
route.get("/", verifyToken,productController.getProduct);
route.get("/pagination",verifyToken,productController.pagination);
route.get("/:id",verifyToken,productController.getProductById);
route.put("/update/:id",verifyToken,(req,res,next) => permissionCheck(req, res, next, "admin.create","staff.create"), productController.updateProduct);
route.delete("/delete/:id",verifyToken,(req,res,next) => permissionCheck(req, res, next, "admin.delete","staff.delete"),productController.deleteById);

route.get("/filter/:name",verifyToken,productController.filterByCategory);
route.get("/search/:name",verifyToken,productController.searchProduct);
route.get("/sort/:asc",verifyToken,productController.sortByProductName);

module.exports = route;