const knex = require("../../config/db");

exports.up = async(knex) => {
    await knex.schema.createTable("role_permission",(table) => {
        table.increments("id").primary(),
        table.integer("role_id")
            .unsigned()
            .references("id")
            .inTable("role")
            .onDelete("CASCADE")
        table.integer("permission_id")
            .unsigned()
            .references("permission_id")
            .inTable("permissions")
            .onDelete("CASCADE")
        table.boolean("value").notNullable()
    });
}

exports.down = async(knex) => {
    await knex.schema.dropTableIfExists("role_permission");
}



