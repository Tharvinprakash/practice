exports.seed = async (knex) => {
    await knex('inventory').del();

    await knex('inventory').insert([
        {
            user_id: 1,
            staff_id: 1,
            product_id: 1,
            supplier_id: 1
        },
        {
            user_id: 1,
            staff_id: 1,
            product_id: 2,
            supplier_id: 1
        },
        {
            user_id: 1,
            staff_id: 1,
            product_id: 5,
            supplier_id: 1
        },
        {
            user_id: 1,
            staff_id: 1,
            product_id: 3,
            supplier_id: 2
        },
        {
            user_id: 1,
            staff_id: 1,
            product_id: 4,
            supplier_id: 3
        },
    ]);
}