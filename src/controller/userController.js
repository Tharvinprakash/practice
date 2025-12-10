const express = require('express');
const knex = require('../../config/db');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require("dotenv").config()


exports.delete = async (req, res) => {
    let user;
    try {
        user = await knex('users').where({ id: req.params.id }).first();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    }
    catch (err) {
        console.log(err);
    }
    await knex('users').where({ id: req.params.id }).del();
    return res.status(200).json({ message: "user deleted" });
}

exports.getUsers = async (req, res) => {
    const users = await knex('users').select('*');
    return res.send(users);
}

exports.getUserById = async (req, res) => {
    let user;
    try {
        user = await knex('users').where({ id: req.params.id }).first();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    }
    catch (err) {
        console.log(err);
    }
    return res.send(user);
}

exports.updateUser = async (req, res) => {
    let user;
    try {
        user = await knex('users').where({ id: req.params.id }).first();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    }
    catch (err) {
        console.log(err);
    }

    userName = req.body.name;
    userEmail = req.body.email;
    userPassword = req.body.password;

    await knex('users').where({ id: req.params.id }).update({
        name: userName,
        email: userEmail,
        password: userPassword
    })

    return res.status(200).json({ message: "User updated" });
}

exports.deleteById = async (req, res) => {
    let user;
    try {
        user = await knex('users').where({ id: req.params.id }).first();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    }
    catch (err) {
        console.log(err);
    }
    await knex('users').where({ id: req.params.id }).del();
    return res.status(200).json({ message: "user deleted" });
}






