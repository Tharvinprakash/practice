const express = require('express');
const knex = require('../../config/db');

exports.getLowStocks = async(req,res) => {
    let lowStocks = await knex("stocks as s")
                    .leftJoin("products as p","s.product_id","p.id")
                    .where("s.quantity","<",knex.ref("p.min_quantity"))
                    .select("p.id","p.name","s.quantity");
    return res.status(200).send(lowStocks);             
}


