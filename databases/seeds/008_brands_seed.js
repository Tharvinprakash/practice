exports.seed = async (knex) => {
    await knex('brands').del();

    await knex('brands').insert([
        {
            name: "VIVO",
            name_slug: "vivo",
            logo_img: "imgUrl1"
        },
        {
            name: "OPPO",
            name_slug: "oppo",
            logo_img: "imgUrl2"
        },
        {
            name: "ACER",
            name_slug: "acer",
            logo_img: "imgUrl3"
        },
        {
            name: "PC",
            name_slug: "pc",
            logo_img: "imgUrl4"
        },
        {
            name: "NOKIA",
            name_slug: "nokia",
            logo_img: "imgUrl5"
        }
    ]);
}