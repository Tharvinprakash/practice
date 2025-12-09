const express = require('express');
const knex = require('../../config/db');


exports.getRecentSales = async (req, res) => {
    let recentSales = await knex("orders as o").orderBy("o.id", "desc")
        .leftJoin("users as u", "o.user_id", "u.id")
        .leftJoin("users as s", "o.staff_id", "s.id")
        .select("o.invoice_number", "u.name as customer_name",
            "s.name as staff_name", "o.is_paid",
            "o.grand_total", "o.created_at");
    // console.log(recentSales);
    return res.status(200).send(recentSales);
}


exports.getRecentPurchases = async (req, res) => {
    let recentPurchases = await knex("inventory_items as i").orderBy("i.id", "desc")
        .leftJoin("inventory as inv", "i.inventory_id", "inv.id")
        .leftJoin("products as p", "p.id", "inv.product_id")
        .leftJoin("suppliers as s", "s.id", "inv.supplier_id")
        .leftJoin("users as u", "u.id", "inv.staff_id")
        .select("i.invoice_number", "u.name as staff_name", "p.name as product_name",
            "s.name as supplier_name",
            "i.grand_total as total", "i.actual_arrival_date as date"
        )
    // console.log(recentPurchases);
    return res.status(200).send(recentPurchases);
}

exports.topProductsOnSale = async (req, res) => {
    let topProductOnSales = await knex("order_items as o")
        .leftJoin("products as p", "p.id", "o.product_id")
        .select("p.id as product_id", "p.name as product_name")
        .sum({ total: knex.raw("o.quantity * o.price") })
        .sum("o.quantity as quantity")
        .groupBy("p.id")
        .orderBy("total", "desc")
        .limit(5);
    // console.log(topProductOnSales);
    return res.status(200).send(topProductOnSales);
}

exports.topProductsOnPurchase = async (req, res) => {
    let topProductOnPurchases = await knex("inventory_items as i")
                                        .leftJoin("inventory as inv","inv.id","i.inventory_id")
                                        .leftJoin("products as p","p.id","inv.product_id")
                                        .select("p.id as product_id","p.name as product_name")
                                        .sum({total: "i.grand_total"})
                                        .groupBy("p.id")
                                        .orderBy("total","desc")
                                        .limit(5);
    // console.log(topProductOnPurchases);
    return res.status(200).send(topProductOnPurchases);
}

exports.getTopSuppliers = async(req,res) => {
    let topSuppliers = await knex("inventory as i")
                                .leftJoin("inventory_items as inv","inv.inventory_id","i.id") 
                                .leftJoin("suppliers as s","s.id","i.supplier_id")
                                .leftJoin("products as p","p.id","i.product_id")
                                .select("s.name as supplier_name","p.name as product_name")
                                .sum({total: "inv.grand_total"})
                                .groupBy("p.id")
                                .orderBy("total","desc")
                                .limit(5);
    // console.log(topSuppliers);
    return res.status(200).send(topSuppliers);
}

exports.getTopCustomers = async(req,res) => {
    let topCustomers = await knex("orders as o")
                            .leftJoin("order_items as ord","ord.order_id","o.id")
                            .leftJoin("users as u","u.id","o.user_id")
                            .leftJoin("products as p","p.id","ord.product_id")
                            .select("u.name as customer_name","p.name as product_name")
                            .sum({total: "o.grand_total"})
                            .groupBy("u.id")
                            .orderBy("total","desc")
                            .limit(5);
    // console.log(topCustomers);
    return res.status(200).send(topCustomers);
}

exports.totalSales = async(req,res) => {
    const{from,to} = req.body;
    let totalSales = await knex("orders as o")
                            .whereBetween("o.created_at",[`${from} 00:00:00`,`${to} 23:59:59`])
                            .sum("o.grand_total as total");

    console.log(totalSales);
    return res.status(200).send(totalSales);
}

exports.totalPurchases = async(req,res) => {
    const{from,to} = req.body;
    let totalPurchases = await knex("inventory_items as i")
                            .whereBetween("i.actual_arrival_date",[`${from} 00:00:00`,`${to} 23:59:59`])
                            .sum("i.grand_total as total");
    // console.log(totalPurchases);
    return res.status(200).send(totalPurchases);
}

exports.profit = async(req,res) => {
    let totalSalesRow = await knex("orders as o")
                            .sum("o.grand_total as total");

    console.log(totalSalesRow);
    let totalSales = totalSalesRow[0].total || 0;
    
    let totalPurchasesRow = await knex("inventory_items as i")
                                .sum("i.grand_total as total");

    let totalPurchases = totalPurchasesRow[0].total || 0;
                                

    let profit = totalSales - totalPurchases;

    console.log(profit);
    return res.status(200).json({profit : profit});
}

exports.getTotalCustomers = async(req,res) => {
    let getTotalCustomers = await knex("users").where("role_id",3)
    return res.status(200).json({total_customers : getTotalCustomers.length});
}

exports.getTotalStaffs = async(req,res) => {
    let getTotalStaffs = await knex("users").where("role_id",2)
    return res.status(200).json({total_staffs : getTotalStaffs.length});
}

exports.getTotalSuppliers = async(req,res) => {
    let getTotalSuppliers = await knex("suppliers").count("id as total_suppliers");
    return res.status(200).send(getTotalSuppliers);
}