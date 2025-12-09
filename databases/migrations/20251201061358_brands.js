
exports.up = async (knex) => {
    await knex.schema.createTable("brands", (table) => {
        table.increments("id").primary();
        table.string("name");
        table.string("name_slug");
        table.longtext("logo_img").notNullable();
    })
};


exports.down = async (knex) => {
    await knex.schema.dropTableIfExists("brands");
};
