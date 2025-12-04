exports.up = async (knex) => {
  await knex.schema.createTable("payment_transactions", (table) => {
    table.increments("id").primary();
    table.integer("order_id").unsigned().references("id")
            .inTable("orders");
    table.string("transaction_id").nullable();
    table.integer("payment_mode_id").unsigned().references("id")
            .inTable("payment_modes");
    table.timestamp("paid_at").nullable();
    table.timestamp("closed_at").nullable();
  });
};

exports.down = async (knex) => {
    await knex.schema.dropTableIfExists("payment_transactions");
};
