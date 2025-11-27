const knex = require('../../config/db');

exports.up = async(knex) => {
    await knex.schema.createTable("permissions",(table) => {
        table.increments("permission_id").primary(),
        table.string("name")       
        table.string("display_name")
        table.timestamps(true,true)
    });
}

exports.down = async(knex) => {
    await knex.schema.dropTableIfExists("permissions");
}

