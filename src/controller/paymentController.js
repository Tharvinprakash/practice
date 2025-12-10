const express = require('express');
const knex = require('../../config/db');


function validation(name, type){
    let error = {};

    if (name.length == 0) {
        error.name = "name length atleast 1";
    }
    
    if (!type) {
        error.percent = "type required";
    }
    
    return error;
}

exports.create = async (req, res) => {
    const userId = req.user.id;
    const { name, type,is_active } = req.body;
    const error = validation(name, type);
    const errLength = Object.keys(error).length;
    if(errLength > 0){
        return res.status(400).send(error);
    }

    try {
        let existingPaymentMode = await knex("payment_modes").where({name: name}).first();
        if(existingPaymentMode){
            return res.status(400).json({message: "Payment mode already exists"});
        }
        if(!existingPaymentMode){
            await knex("payment_modes").insert({
                name: name, 
                type: type,
                is_active: is_active,
                created_by: userId,
                updated_by: userId,
            });
        }
        return res.status(200).json({message: "payment modes added"});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Error while adding payment modes"});
    }
}

exports.getPayments = async (req, res) => {
    let payments = await knex("payment_modes").select("*")
    return res.send(payments);
}

exports.getPaymentById = async (req, res) => {
    let paymentId = req.params.id;
    if (!paymentId) {
        return res.status(400).json({ message: "payment id is  missing" });
    }
    let payment;
    try {
        payment = await knex("payment_modes").where({ id: paymentId }).first();
        return res.status(200).send(payment);
    } catch (error) {
        return res.status(400).json({ message: "error while parsing get payment modes" });
    }
}

exports.update = async (req, res) => {
    const paymentId = req.params.id;
    const userId = req.user.id;
    if(!paymentId){
        return res.status(400).json({ message: "payment id is  missing" });
    }
    if(!userId){
        return res.status(400).json({ message: "user id is  missing" });
    }
    const { name, type,is_active } = req.body;
    const error = validation(name, type);
    const errLength = Object.keys(error).length;
    if(errLength > 0){
        return res.status(400).send(error);
    }
    let payment;
    try {
        let existingPayment = await knex("payment_modes").where({ name: name }).first();
        if (existingPayment) {
            return res.status(400).json({ message: "payment modes exist" });
        }
        payment = await knex("payment_modes").where({ id: paymentId }).first();
        if (!paymentId) {
            return res.status(404).json({ message: "payment modes not found" });
        }
        if (payment) {
            await knex("payment_modes").where({ id: paymentId }).update({
                name: name,
                type: type, 
                is_active: is_active,
                updated_by: userId
            });
        }
        return res.status(200).json({ message: "payment modes updated" });
    } catch (error) {
        return res.status(400).json({ message: "error while updating payment modes" });
    }
}

exports.delete = async (req, res) => {
    let paymentId = req.params.id;
    if (!paymentId) {
        return res.status(400).json({ message: "payment id is  missing" });
    }
    let payment;
    try {
        payment = await knex("payment_modes").where({ id: paymentId }).first();
        if (!payment) {
            return res.status(404).json({ message: "payment modes is not found" });
        }
        if (payment) {
            await knex("payment_modes").where({ id: paymentId }).del();
        }
        return res.status(200).json({ message: "payment modes deleted" });
    } catch (error) {
        return res.status(400).json({ message: "error while deleting payment modes" })
    }
}

