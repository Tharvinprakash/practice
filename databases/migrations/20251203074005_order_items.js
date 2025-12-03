exports.up = async (knex) => {
    await knex.schema.createTable("order_items", (table) => {
        table.increments("id").primary();
        table.integer("product_id").unsigned()
            .references("id")
            .inTable("products")
            .onDelete("CASCADE");
        table.integer("order_id").unsigned()
            .references("id")
            .inTable("orders")
            .onDelete("CASCADE");
        table.integer("quantity")
            .notNullable();
        table.decimal("price");
        table.decimal("subtotal");
        table.timestamps(true, true);
    })
};


exports.down = async (knex) => {
    await knex.schema.dropTableIfExists("order_items");
};









