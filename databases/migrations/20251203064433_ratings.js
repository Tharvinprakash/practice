const knex = require('../../config/db');


exports.up = async(knex) =>  {
    await knex.schema.createTable("ratings",(table) => {
        table.increments("id").primary();
        table.integer("rating");
        table.longtext("review");
        table.integer("user_id").unsigned()
            .references("id")
            .inTable("users")
            .notNullable()
            .onDelete("CASCADE");
        table.integer("product_id").unsigned()
            .references("id")
            .inTable("products")
            .notNullable()
            .onDelete("CASCADE");
        table.timestamps(true,true);
    });
};


exports.down = async(knex) => {
  await knex.schema.dropTableIfExists("ratings");
};





