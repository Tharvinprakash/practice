const knex = require('../../config/db');

exports.up = async (knex) => {
    await knex.schema.createTable("users",(table) => {
        table.increments("id").primary(),
        table.string("name").notNullable(),
        table.string("email").unique().notNullable(),
        table.string("password").notNullable(),
        table.timestamps(true,true)
    });
}

exports.down = async(knex) => {
    await knex.schema.dropTableIfExists("users");
}









