const knex = require('knex')(require('../knexfile').development);

const{attachPaginate} = require('knex-paginate');
attachPaginate();

module.exports = knex;



// created a units,suppliers,inventory,inventory items table
// seeded a data for units,suppliers,inventory,inventory items table
// created a crud for units,suppliers,inventory,inventory items
// check on postman  units,suppliers,inventory,inventory items api endpoints


/*

Developed database tables for units, suppliers, inventory, and inventory items.

Seeded initial data for all four tables to support application functionality.

Implemented full CRUD operations for units, suppliers, inventory, and inventory items.

Tested and verified all API endpoints using Postman for accurate and reliable responses.

*/