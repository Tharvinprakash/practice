exports.up = async (knex) => {
    await knex.schema.createTable("inventory", (table) => {
        table.increments("id").primary();
        table.integer("product_id").unsigned().references("id")
                .inTable("products");
        table.integer("supplier_id").unsigned().references("id")
                .inTable("suppliers");
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTableIfExists("inventory");
};
