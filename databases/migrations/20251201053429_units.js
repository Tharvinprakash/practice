exports.up = async (knex) => {
    await knex.schema.createTable("units", (table) => {
        table.increments("id").primary();
        table.string("unit_name");
        table.string("name");
        table.timestamps(true,true);
    })
};

exports.down = async (knex) => {
    await knex.schema.dropTableIfExists("units");
};



