const express = require('express');
const knex = require('../../config/db');
const slugify = require('slugify');


function validation(name, description, is_active, is_delete) {
    let error = {};

    if (name.length < 6) {
        error.name = "name length atleast 6";
    }

    if (description.length < 10) {
        error.password = "description length atleast 10";
    }

    if (typeof is_active !== "boolean") {
        error.is_active = "is active must be true or false";
    }

    if (typeof is_delete !== "boolean") {
        error.is_delete = "is delete must be true or false";
    }

    return error;
}

exports.addCategory = async (req, res) => {
    const { name, description, is_active, is_delete } = req.body;
    const error = validation(name, description, is_active, is_delete);
    const errLength = Object.keys(error).length;
    if (errLength > 0) {
        return res.status(400).send(error);
    }

    try {
        let category = await knex("categories").where({ name: name }).first();
        console.log("category", category);
        if (category) {
            return res.status(400).json({ message: "category exist" });
        }
        if (!category) {
            console.log(name, slugify(name), description, is_active, is_delete);
            await knex("categories").insert({
                name: name,
                name_slug: slugify(name),
                description: description,
                is_active: is_active,
                is_delete: is_delete
            });
        }
        return res.status(201).json({ message: "category created" })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "error while creating a category" })
    }
}

exports.getCategory = async (req, res) => {
    let categories = await knex("categories").select("*")
    return res.send(categories);
}

exports.getCategoryById = async (req, res) => {
    let categoryId = req.params.id;
    if (!categoryId){
        return res.status(400).json({message: "categoryId missing"});
    }
    let category;
    try {
        category = await knex("categories").where({id:categoryId}).first();
        return res.status(200).send(category);
    } catch (error) {
        return res.status(400).json({message: "error while parsing get category"});
    
    }
}

exports.updateCategory = async (req, res) => {
    const categoryId = req.params.id;
    const { name, description, is_active, is_delete } = req.body;
    const error = validation(name, description, is_active, is_delete);
    const errLength = Object.keys(error).length;
    if (errLength > 0) {
        return res.status(400).send(error);
    }
    let category;
    try {
        let existingCategory = await knex("categories").where({ name: name }).first();
        if (existingCategory) {
            return res.status(400).json({ message: "category exist" });
        }
        category = await knex("categories").where({ id: categoryId }).first();
        if (!categoryId) {
            return res.status(404).json({ message: "category not found" });
        }
        if (category) {
            await knex("categories").where({ id: categoryId }).update({
                name: name,
                name_slug: slugify(name),
                description: description,
                is_active: is_active,
                is_delete: false
            });
        }
        return res.status(200).json({ message: "category updated" });
    } catch (error) {
        return res.status(400).json({ message: "error while updating category" });
    }
}

exports.deleteById = async(req,res) => {
    let categoryId = req.params.id;
    if (!categoryId){
        return res.status(400).json({message: "categoryId missing"});
    }
    let category;
    try {
        category = await knex("categories").where({id: categoryId}).first();
        if(!category){
            return res.status(404).json({message: "category is not found"});
        }
        if(category){
            await knex("categories").where({id:categoryId}).del();
        }
        return res.status(200).json({message: "category deleted"});
    } catch (error) {
        return res.status(400).json({message: "error while deleting category"})
    }
}

exports.searchCategory = async(req,res) => {
    const categoryName = req.params.name;
    console.log(categoryName)
    let category;
    try {
        category = await knex("categories")
                        .where('name','like',`%${categoryName.toLowerCase()}%`)
                        .select("*");
        console.log(category);
        if(category.length == 0){
            return res.status(404).json({message: "No search result"});
        }
        return res.status(200).send(category);
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Error while searching category"});
    }
}

