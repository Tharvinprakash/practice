exports.seed = async (knex) => {
    await knex('inventory_items').del();

    await knex('inventory_items').insert([
        {
            inventory_id: 1,
            invoice_number: "INV_1234567890",
            is_available: true,
            quantity: 2,
            payment_type: "credit",
            order_type: "received",
            payment_status: "paid",
            expected_arrival_date: "05/12/2025",
            actual_arrival_date: "07/12/2025"
        }
    ])
}

/*

006_products_seed - 012_units_seed
007_ratings_seed - 013_supplier_seed
008_ - product_seed
009_product_settings - 007_ratings_seed
010_tax_seed - 009_product_settings
011_payments_seed - 010_tax_seed
012_units_seed - 011_payments_seed 
013 - inventory_seed
014 - 015_inventory_items_seed

*/