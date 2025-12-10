exports.seed = async (knex) => {
    await knex('inventory_items').del();

    await knex('inventory_items').insert([
        {
            inventory_id: 1,
            invoice_number: "INV_1234567890",
            is_available: true,
            quantity: 2,
            tax_id: 1,
            payment_due_date: "2025-12-06 00:00:00",
            payment_type: "credit",
            order_type: "received",
            payment_status: "paid",
            grand_total: 80000,
            expected_arrival_date: "2025-12-05 12:23:21",
            actual_arrival_date: "2025-12-07 15:06:01"
        }
    ])
}

