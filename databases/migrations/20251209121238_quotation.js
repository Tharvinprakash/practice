
exports.up = async(knex) => {
  await knex.schema.createTable("quotations", (table) => {
        table.increments("id").primary();
        table.string("ref_no");
        table.integer("supplier_id").unsigned()
                .references("id")
                .inTable("suppliers")
                .onDelete("CASCADE");
        table.integer("product_id").unsigned()
                .references("id")
                .inTable("products")
                .onDelete("CASCADE");
        table.integer("grand_total");
        table.integer("added_by");
        table.integer("discount");
        table.enu("payment_status",["paid","partially_paid","unpaid"]);
    })
};


exports.down = async(knex) => {
    await knex.schema.dropTableIfExists("quotations");
};
