exports.seed = async (knex) => {
    await knex('inventory').del();

    await knex('inventory').insert([
        {
            product_id: 1,
            supplier_id: 1
        },
        {
            product_id: 2,
            supplier_id: 1
        },
        {
            product_id: 5,
            supplier_id: 1
        },
        {
            product_id: 3,
            supplier_id: 2
        },
        {
            product_id: 4,
            supplier_id: 3
        },
    ]);
}