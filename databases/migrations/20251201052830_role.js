const knex = require('../../config/db');

exports.up = async(knex) => {
    await knex.schema.createTable("role",(table) => {
        table.increments("id").primary();
        table.string('name').notNullable();
        table.string('display_name').notNullable();
        table.boolean('is_delete').notNullable();
        table.boolean('active').notNullable();
        table.timestamps(true,true)
    });
}

exports.down = async(knex) => {
    await knex.schema.dropTableIfExists("role");
}