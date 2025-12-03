exports.seed = async (knex) => {
    await knex('tax').del();

    await knex('tax').insert([
        {
            name: "GST",
            percent: 5,
            is_active: true,
            created_by: 1,
            updated_by: 1
        },
        {
            name: "VAT",
            percent: 10,
            is_active: true,
            created_by: 1,
            updated_by: 1
        }
    ])
}