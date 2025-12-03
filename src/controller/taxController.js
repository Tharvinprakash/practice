const express = require('express');
const knex = require('../../config/db');


function validation(name, percent){
    let error = {};

    if (name.length != 0) {
        error.name = "name length atleast 1";
    }
    
    if (!percent) {
        error.percent = "percent required";
    }
    
    return error;
}

exports.create = async (req, res) => {
    const userId = req.user.id;
    const { name, percent, is_active } = req.body;
    const error = validation(name, percent);
    const errLength = Object.keys(error).length;
    if(errLength > 0){
        return res.status(400).send(error);
    }

    try {
        let existingTax = await knex("tax").where({name: name}).first();
        if(existingTax){
            return res.status(400).json({message: "Tax already exists"});
        }
        if(!existingTax){
            await knex("tax").insert({
                name: name,
                percent: percent, 
                is_active: is_active,
                created_by: userId,
                updated_by: userId
            });
        }
        return res.status(200).json({message: "Tax added"});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Error while adding tax"});
    }
}

exports.getTaxes = async (req, res) => {
    let taxes = await knex("tax").select("*")
    return res.send(taxes);
}

exports.getTaxById = async (req, res) => {
    let taxId = req.params.id;
    if (!taxId) {
        return res.status(400).json({ message: "taxId missing" });
    }
    let tax;
    try {
        tax = await knex("tax").where({ id: taxId }).first();
        return res.status(200).send(tax);
    } catch (error) {
        return res.status(400).json({ message: "error while parsing get tax" });

    }
}

exports.update = async (req, res) => {
    const taxId = req.params.id;
    const userId = req.user.id;
    const { name, percent, is_active } = req.body;
    const error = validation(name, percent);
    const errLength = Object.keys(error).length;
    if(errLength > 0){
        return res.status(400).send(error);
    }
    let tax;
    try {
        let existingTax = await knex("tax").where({ name: name }).first();
        if (existingTax) {
            return res.status(400).json({ message: "tax exist" });
        }
        tax = await knex("tax").where({ id: taxId }).first();
        if (!taxId) {
            return res.status(404).json({ message: "tax not found" });
        }
        if (tax) {
            await knex("tax").where({ id: taxId }).update({
                name: name,
                percent: percent, 
                is_active: is_active,
                updated_by: userId
            });
        }
        return res.status(200).json({ message: "tax updated" });
    } catch (error) {
        return res.status(400).json({ message: "error while updating tax" });
    }
}

exports.delete = async (req, res) => {
    let taxId = req.params.id;
    if (!taxId) {
        return res.status(400).json({ message: "taxId missing" });
    }
    let tax;
    try {
        tax = await knex("products").where({ id: taxId }).first();
        if (!tax) {
            return res.status(404).json({ message: "tax is not found" });
        }
        if (tax) {
            await knex("products").where({ id: taxId }).del();
        }
        return res.status(200).json({ message: "tax deleted" });
    } catch (error) {
        return res.status(400).json({ message: "error while deleting tax" })
    }
}

