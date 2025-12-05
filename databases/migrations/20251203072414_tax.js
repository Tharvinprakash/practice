exports.up = async(knex) => {
  await knex.schema.createTable("tax",(table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.integer("percent").notNullable();
    table.boolean("is_active").defaultTo(true);
    table.integer("created_by").unsigned()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
    table.integer("updated_by").unsigned()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
    
    table.timestamps(true,true);
  })
};


exports.down = async(knex) => {
  await knex.schema.dropTableIfExists("tax");
};




