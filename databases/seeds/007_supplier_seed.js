exports.seed = async (knex) => {
    await knex('suppliers').del();

    await knex('suppliers').insert([
        {
            name: "Raj",
            phone_no: "1234567890",
            email: "Raj@gmail.com",
            address: "1 City",
            city: "City A",
            state: "Tamilnadu",
            gst_number: "123456789012345",
            referred_staff: 1,
            created_by: 1,
            updated_by: 1 
        },
        {
            name: "Ram",
            phone_no: "1234567890",
            email: "Ram@gmail.com",
            address: "2 City",
            city: "City B",
            state: "Tamilnadu",
            gst_number: "123456789011111",
            referred_staff: 1,
            created_by: 1,
            updated_by: 1 
        },
        {
            name: "Ash",
            phone_no: "1234567890",
            email: "Ash@gmail.com",
            address: "3 City",
            city: "City C",
            state: "Tamilnadu",
            gst_number: "123456789067890",
            referred_staff: 1,
            created_by: 1,
            updated_by: 1 
        },
    ]);
}    



