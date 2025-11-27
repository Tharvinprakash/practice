exports.seed = async (knex) => {
    await knex('role_permission').del();

    await knex('role_permission').insert([
        {
            role_id: 1,
            permission_id: 1,
            value: true
        },
        {
            role_id: 1,
            permission_id: 2,
            value: true
        },
        {
            role_id: 1,
            permission_id: 3,
            value: true
        },
        {
            role_id: 1,
            permission_id: 4,
            value: true
        },
        {
            role_id: 1,
            permission_id: 5,
            value: true
        },
        {
            role_id: 1,
            permission_id: 6,
            value: true
        },
        {
            role_id: 2,
            permission_id: 1,
            value: false
        },
        {
            role_id: 2,
            permission_id: 2,
            value: false
        },
        {
            role_id: 2,
            permission_id: 3,
            value: true
        },
        {
            role_id: 2,
            permission_id: 4,
            value: true
        },
        {
            role_id: 2,
            permission_id: 5,
            value: true
        },
        {
            role_id: 2,
            permission_id: 6,
            value: true
        },
        {
            role_id: 3,
            permission_id: 1,
            value: false
        },
        {
            role_id: 3,
            permission_id: 2,
            value: false
        },
        {
            role_id: 3,
            permission_id: 3,
            value: false
        },
        {
            role_id: 3,
            permission_id: 4,
            value: false
        },
        {
            role_id: 3,
            permission_id: 5,
            value: false
        },
        {
            role_id: 3,
            permission_id: 6,
            value: false
        },
    ])
}