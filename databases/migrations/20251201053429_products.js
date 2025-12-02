const knex = require('../../config/db');

exports.up = async(knex) => {
    await knex.schema.createTable("products",(table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("name_slug");
        table.longtext("image").notNullable(); 
        table.string("description").notNullable();
        table.decimal("marked_price").notNullable();
        table.decimal("purchased_price").notNullable();
        table.decimal("selling_price").notNullable();
        table.integer("category").unsigned()
                .notNullable()
                .references("id")
                .inTable("categories")
                .onDelete("CASCADE");
        table.integer("stock").notNullable()
                .defaultTo(0);        
        table.boolean("is_active").notNullable();  
        table.boolean("is_delete").notNullable();      
        table.string("ratings");
        table.string("reviews");
        table.timestamps(true,true);
    });
}

     
exports.down = async(knex) => {
    await knex.schema.dropTableIfExists("products");
}

