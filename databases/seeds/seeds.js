exports.seed = async (knex) => {
    await knex('users').del();

    await knex('users').insert([
        {
            name : "Tharvin",
            email : "tharvin@example.com",
            password: "123456"
        },
        {
            name : "prakash",
            email : "prakash@example.com",
            password: "3245"
        },
        {
            name : "dharun",
            email : "dharun@example.com",
            password: "123456"
        },
        {
            name : "Raj",
            email : "Raj@example.com",
            password: "123456"
        },
        {
            name : "Ravi",
            email : "Ravi@example.com",
            password: "123456"
        }
    ]);
}



