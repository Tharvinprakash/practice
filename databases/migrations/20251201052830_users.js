const knex = require('../../config/db');

exports.up = async (knex) => {
    await knex.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("email").unique().notNullable();
        table.string("password").nullable();
        table.integer("role_id")
            .unsigned()
            .references("id")
            .inTable("role")
            .onDelete("CASCADE")
            .defaultTo(3)
        table.string("google_id").nullable();
        table.string("phone_number").nullable();
        table.string("otp");
        table.timestamp("otp_expiration");
        table.timestamps(true, true)
    });
}


exports.down = async(knex) => {
    await knex.schema.dropTableIfExists("users");
}



// 20251201052830_role
// 




