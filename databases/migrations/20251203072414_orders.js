exports.up = async (knex) => {
    await knex.schema.createTable("orders", (table) => {
        table.increments("id").primary();
        table.string("invoice_number").notNullable();
        table.integer("user_id").unsigned()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
        table.integer("staff_id").unsigned()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
        table.integer("discount");
        table.integer("quantity");
        table.decimal("subTotal");
        table.integer("tax_id").unsigned()
            .references("id")
            .inTable("tax")
            .onDelete("CASCADE");
        table.integer("tax_amount");
        table.integer("payment_id").unsigned()
            .references("id")
            .inTable("payment_modes");
        table.boolean("is_paid");
        table.decimal("grand_total");
        table.timestamps(true, true);
    })
};

exports.down = async (knex) => {
    await knex.schema.dropTableIfExists("orders");
};

