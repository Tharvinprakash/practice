
exports.up = async (knex) => {
    await knex.schema.createTable("suppliers", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("phone_no").notNullable();
        table.string("email").unique().notNullable();
        table.string("address").notNullable();
        table.string("city").notNullable();
        table.string("state").notNullable();
        table.string("gst_number").notNullable();
        table.integer("referred_staff").unsigned()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
        table.integer("created_by").unsigned()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
        table.integer("updated_by").unsigned()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
    });

};


exports.down = async (knex) => {
    await knex.schema.dropTableIfExists("suppliers");
};


