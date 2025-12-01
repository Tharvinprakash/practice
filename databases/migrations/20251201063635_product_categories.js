const knex = require("../../config/db")

exports.up = async (knex) => {
    await knex.schema.createTable("product_categories", (table) => {
        table.increments("id").primary();
        table.integer("product_id").unsigned()
            .references("id")
            .inTable("products")
            .notNullable()
            .onDelete("CASCADE");
        table.integer("category_id").unsigned()
            .references("id")
            .inTable("categories")
            .notNullable()
            .onDelete("CASCADE");
    });
}


exports.down = async (knex) => {
    await knex.schema.dropTableIfExists("product_categories", (table) => {
    });

}

