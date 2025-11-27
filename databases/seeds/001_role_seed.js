exports.seed = async(knex) => {
    await knex('role').del();

    await knex('role').insert([
        {
            name : "admin",                     //      1
            display_name : "ADMIN",
            is_delete : false,
            active : true
        },
        {
            name : "staff",                    //       2
            display_name : "STAFF",
            is_delete : false,
            active : true
        },
        {
            name : "customer",                 //        3
            display_name : "CUSTOMER",
            is_delete : false,
            active : true
        },
    ]);
}
