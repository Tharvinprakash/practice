const express = require('express');
const knex = require('../../config/db');


exports.create = async(req,res) => {

}

exports.getStocks = async(req,res) => {

}

exports.getStockById = async(req,res) => {

}

exports.update = async(req,res) => {

}

exports.delete = async(req,res) => {

}

exports.getLowStocks = async(req,res) => {
    let lowStocks = await knex("stocks as s")
                    .leftJoin("products as p","s.product_id","p.id")
                    .where("s.quantity","<",knex.ref("p.min_quantity"))
                    .select("p.id","p.name","s.quantity");
    // console.log(lowStocks);
    return res.status(200).send(lowStocks);             
}


