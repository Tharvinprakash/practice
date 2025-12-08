const express = require('express')

const route = express.Router();

const dashboardController = require("../controller/dashboardController");


route.get("/recent-sales",dashboardController.getRecentSales);
route.get("/recent-purchases",dashboardController.getRecentPurchases);

route.get("/top-products-sale",dashboardController.topProductsOnSale);
route.get("/top-products-purchase",dashboardController.topProductsOnPurchase);
route.get("/top-suppliers",dashboardController.getTopSuppliers);
route.get("/top-customers",dashboardController.getTopCustomers);

route.get("/total-sales",dashboardController.totalSales);
route.get("/total-purchases",dashboardController.totalPurchases);
route.get("/total-profit",dashboardController.profit);

route.get("/total-customers",dashboardController.getTotalCustomers);
route.get("/total-staffs",dashboardController.getTotalStaffs);
route.get("/total-suppliers",dashboardController.getTotalSuppliers);


module.exports=route;