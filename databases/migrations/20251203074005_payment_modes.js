exports.up = async (knex) => {
        await knex.schema.createTable("payment_modes", (table) => {
                table.increments("id").primary();
                table.string("name").notNullable();
                table.string("type").notNullable();
                table.integer("created_by").unsigned()
                        .references("id")
                        .inTable("users")
                        .onDelete("CASCADE");
                table.integer("updated_by").unsigned()
                        .references("id")
                        .inTable("users")
                        .onDelete("CASCADE");
                table.boolean("is_active").defaultTo(true);
                table.timestamps(true, true);
        })
};


exports.down = async (knex) => {
        await knex.schema.dropTableIfExists("payment_modes");
};











