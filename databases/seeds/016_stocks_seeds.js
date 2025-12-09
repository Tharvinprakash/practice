exports.seed = async (knex) => {
  await knex("stocks").del();

  await knex("stocks").insert([
    {
        product_id: 1,
        quantity: 10
    },
    {
        product_id: 2,
        quantity: 20
    },
    {
        product_id: 3,
        quantity: 25
    },
    {
        product_id: 4,
        quantity: 18
    },
    {
        product_id: 5,
        quantity: 45
    },
  ]);
};
