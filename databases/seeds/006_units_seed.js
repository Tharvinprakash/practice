exports.seed = async (knex) => {
    await knex('units').del();

    await knex('units').insert([
        {
            unit_name: "Kg",
            name: "Kilo gram"
        },
        {
            unit_name: "Ltr",
            name: "Litre"
        },
        {
            unit_name: "Pcs",
            name: "Pieces"
        },
    ]);
}






