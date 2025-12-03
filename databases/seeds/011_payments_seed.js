exports.seed = async (knex) => {
    await knex('payment_modes').del();

    await knex('payment_modes').insert([
        {
            name: "razorpay",
            type: "upi",
            created_by: 1,
            updated_by: 1,
            is_active: true
        },
        {
            name: "Gpay",
            type: "upi",
            created_by: 1,
            updated_by: 1,
            is_active: true
        },
        {
            name: "Cash",
            type: "cash",
            created_by: 1,
            updated_by: 1,
            is_active: true
        },
    ])
}