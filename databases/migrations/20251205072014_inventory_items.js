
exports.up = async(knex) => {
    await knex.schema.createTable("inventory_items", (table) => {
        table.increments("id").primary();
        table.integer("inventory_id").unsigned().references("id")
                .inTable("inventory");
        table.string("invoice_number").notNullable();
        table.boolean("is_available");
        table.integer("quantity").notNullable();
        table.enu("payment_type",["debit","credit"]);
        table.enu("order_type",["received","refund"]);
        table.enu("payment_status",["paid","partially_paid","unpaid"]);
        table.string("expected_arrival_date");
        table.string("actual_arrival_date");
    });          
};


exports.down = async(knex) => {
    await knex.schema.dropTableIfExists("inventory_items");
};
