const express = require('express');
const knex = require('../../config/db');

function validation(name, email, password) {
    error = {}
    
    if (name.length < 6) {
        error.name = "name length atleast 6";
    }
    const validateEmailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

    if (validateEmailRegex.test(email)) {
        error.email = "email is invalid";
    }

    if (password.length < 8) {
        error.password = "password length atleast 8";
    }
    return error;
}

exports.register = async (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;
    const error = validation(name, email, password);
    // console.log(Object.keys(error).length);
    const errLength = Object.keys(error).length;
    if(errLength > 0){
        res.status(400).send(error);
    }
    await knex('users').insert({
        name: name,
        email: email,
        password: password
    });
    res.status(200).json({ message: "User registered successfully!" })
}

exports.getUsers = async (req, res) => {
    const users = await knex('users').select('*');
    res.send(users);
}

exports.getUserById = async (req, res) => {
    let user;
    try {
        user = await knex('users').where({ id: req.params.id }).first();
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (err) {
        console.log(err);
    }
    res.send(user);
}

exports.updateUser = async (req, res) => {
    let user;
    try {
        user = await knex('users').where({ id: req.params.id }).first();
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (err) {
        console.log(err);
    }

    // console.log(user);
    // console.log(req.body);

    userName = req.body.name;
    userEmail = req.body.email;
    userPassword = req.body.password;

    await knex('users').where({ id: req.params.id }).update({
        name: userName,
        email: userEmail,
        password: userPassword
    })

    res.status(200).json({ message: "User updated" });
}

exports.deleteById = async (req, res) => {
    let user;
    try {
        user = await knex('users').where({ id: req.params.id }).first();
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (err) {
        console.log(err);
    }
    await knex('users').where({ id: req.params.id }).del();
    res.status(200).json({ message: "user deleted" });
}






