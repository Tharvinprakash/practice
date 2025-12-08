exports.up = async (knex) => {
    await knex.schema.createTable("stocks", (table) => {
        table.increments("id").primary();
        table.integer("product_id").unsigned()
                .references("id")
                .inTable("products")
                .onDelete("CASCADE");
        table.integer("quantity");
    })

};

exports.down = async (knex) => {
    await knex.schema.dropTableIfExists("stocks");
};




