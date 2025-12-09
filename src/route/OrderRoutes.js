const express = require('express');

const route = express.Router();

const XLSX = require("xlsx");

const upload = require("../../util/multer")

const orderController = require("../controller/orderController");

const { verifyToken,permissionCheck } = require("../middleware/middleware");

route.post("/create",verifyToken,(req,res,next) => permissionCheck(req, res, next, "admin.create","staff.create"),orderController.create)
route.post("/bulk-upload",upload.excelUpload.single("file"),orderController.bulkUpload);
route.get("/export-orders",orderController.exportOrders);


module.exports = route;
