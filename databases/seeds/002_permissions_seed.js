exports.seed = async(knex) => {
    await knex('permissions').del();

    await knex('permissions').insert([
        {
            name : 'admin.create',                 //      1
            display_name : 'ADMIN CREATE'
        },
        {
            name : 'admin.delete',                 //      2
            display_name : 'ADMIN DELETE'
        },
        {
            name : 'staff.create',                 //      3
            display_name : 'STAFF CREATE'
        },
        {
            name : 'staff.delete',                 //      4
            display_name : 'STAFF DELETE'
        },
        {
            name : 'customer.create',              //      5
            display_name : 'CUSTOMER CREATE'
        },
        {
            name : 'customer.delete',              //      6
            display_name : 'CUSTOMER DELETE'
        },

    ]);
}