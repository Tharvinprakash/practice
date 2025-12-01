exports.seed = async(knex) => {
    await knex('categories').del();

    await knex('categories').insert([
        {
            name: "Mobile phones",
            name_slug: "mobile-phones",
            description: "Mobile phones also support a variety of multimedia capabilities, such as digital photography, video recording, and gaming. In addition, they enable multimedia playback and streaming, including video content, as well as radio and television streaming",
            is_active: true,
            is_delete: false
        },
        {
            name: "Smart phones",
            name_slug: "smart-phones",
            description: "Smart phones also support a variety of multimedia capabilities, such as digital photography, video recording, and gaming. In addition, they enable multimedia playback and streaming, including video content, as well as radio and television streaming",
            is_active: true,
            is_delete: false
        },
        {
            name: "Laptop",
            name_slug: "laptop",
            description: "Laptop also support a variety of multimedia capabilities, such as digital photography, video recording, and gaming. In addition, they enable multimedia playback and streaming, including video content, as well as radio and television streaming",
            is_active: true,
            is_delete: false
        },
        {
            name: "Desktop",
            name_slug: "desktop",
            description: "Desktop also support a variety of multimedia capabilities, such as digital photography, video recording, and gaming. In addition, they enable multimedia playback and streaming, including video content, as well as radio and television streaming",
            is_active: true,
            is_delete: false
        }

    ]);
}