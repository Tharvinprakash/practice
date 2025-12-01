exports.seed = async (knex) => {
    await knex('ratings').del();

    await knex('ratings').insert([
        {
            rating: "5",
            review: "Vivo 5G Charger in the Box (Lily White, 128 GB)  (6 GB RAM)",
            user_id: 1,
            product_id: 1
        },
        {
            rating: "3",
            review: "Oppo 5G Charger in the Box (Lily White, 128 GB)  (6 GB RAM)",
            user_id: 1,
            product_id: 2
        },
        {
            rating: "4",
            review: "Acer 5G Charger in the Box (Lily White, 128 GB)  (6 GB RAM)",
            user_id: 1,
            product_id: 3
        },
        {
            rating: "2",
            review: "PC 5G Charger in the Box (Lily White, 128 GB)  (6 GB RAM)",
            user_id: 1,
            product_id: 4
        },
        {
            rating: "5",
            review: "nokia is a mobile phone",
            user_id: 1,
            product_id: 5
        }
    ]);

}

