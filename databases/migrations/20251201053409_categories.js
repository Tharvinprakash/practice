const knex = require('../../config/db');

exports.up = async(knex) => {
    await knex.schema.createTable("categories",(table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("name_slug");
        table.string("description").notNullable();
        table.boolean("is_active").notNullable();      
        table.boolean("is_delete").notNullable();      
        table.timestamps(true,true);
    });
}

exports.down = async(knex) => {
    await knex.schema.dropTableIfExists("categories");
}

