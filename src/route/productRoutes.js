const express = require('express')

const route = express.Router();

const upload = require("../../util/multer")

const productController = require("../controller/productController")

route.post('/upload', upload.upload.single("image"),productController.uploadCheck);
// route.post('/uploadMultiple', upload.uploadMultiple.array("image",5),
// productController.uploadMultipleFileCheck);

route.post("/add",productController.addProduct);
route.get("/", productController.getProduct);
route.get("/pagination",productController.pagination);
route.get("/:id",productController.getProductById);
route.put("/update/:id", productController.updateProduct);
route.delete("/delete/:id",productController.deleteById);

route.get("/filter/:name",productController.filterByCategory);
route.get("/search/:name",productController.searchProduct);
route.get("/sort/:asc",productController.sortByProductName);

module.exports = route;