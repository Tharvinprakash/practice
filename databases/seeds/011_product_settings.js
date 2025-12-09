exports.seed = async (knex) => {
    await knex('product_categories').del();

    await knex('product_categories').insert([
        {
            category_id: 2,
            product_id: 1
        },
        {
            category_id: 2,
            product_id: 2
        },
        {
            category_id: 3,
            product_id: 3
        },
        {
            category_id: 4,
            product_id: 4
        },
        {
            category_id: 1,
            product_id: 5
        }
    ]);

}

