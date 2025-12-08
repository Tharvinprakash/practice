exports.up = async (knex) => {
    await knex.schema.createTable("inventory", (table) => {
        table.increments("id").primary();
        table.integer("product_id").unsigned().references("id")
                .inTable("products");
        table.integer("supplier_id").unsigned().references("id")
                .inTable("suppliers");
        table.integer("user_id").unsigned().references("id")
                .inTable("users");
        table.integer("staff_id").unsigned().references("id")
                .inTable("users");
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTableIfExists("inventory");
};
