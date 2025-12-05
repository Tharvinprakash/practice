const express = require('express')

const route = express.Router();

const unitController = require("../controller/unitController");


route.post("/add", unitController.addUnit);
route.get("/", unitController.getUnits);
route.get("/:id",unitController.getUnitById);
route.put("/update/:id", unitController.updateUnit);
route.delete("/delete/:id",unitController.deleteById);

module.exports=route;

/*

Read and reviewed OAuth2 documentation to understand authentication flows.
Implemented Google OAuth2 login integration in the application.
Tested existing APIs (createAdmin, deleteAdmin, createStaff, deleteStaff, createCustomer, deleteCustomer) using Postman to ensure proper functionality.


Implemented forgot password workflow, including email OTP generation, OTP verification, and secure password reset.
Added new migration tables: products, categories, ratings, and product_categories.
Seeded initial data for products, categories, ratings, and product_categories tables.
Learned about slug concepts and implemented automatic slug generation for product and category names.
Developed full CRUD operations for categories.
Developed full CRUD operations for products, including validation and slug handling.

Uploaded static image files to a dedicated seed folder for storing image URLs.
Studied and applied the multer npm package documentation for file-handling workflows.
Implemented single-file image upload using multer with proper validation and error handling.
Added product filtering functionality based on category.
Implemented search functionality for both product name and category.

Reviewed and applied the knex-paginate documentation to implement pagination with dynamic limit support for both products and categories. 
Added sorting functionality for both ascending and descending order on products and categories.
Created migration files for orders, order items, tax, and payment mode tables.
Seeded initial data for tax and payment modes.
Implemented complete CRUD operations for both tax and payment mode modules.

Created an order controller and order_items controller with comprehensive and reliable error handling.
Implemented full database transaction support, ensuring atomic operations through proper commit and rollback mechanisms for both order and order_items modules.
Reviewed Stripe documentation 
successfully integrated Stripe payment processing into the order workflow, verifying the implementation using Postman and Stripe CLI.

Developed database tables for units, suppliers, inventory, and inventory items.
Seeded initial data for all four tables to support application functionality.
Implemented full CRUD operations for units, suppliers, inventory, and inventory items.
Tested and verified all API endpoints using Postman for accurate and reliable responses.


*/
