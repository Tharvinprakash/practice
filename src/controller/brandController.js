const express = require('express');
const knex = require('../../config/db');
const slugify = require('slugify');

function validation(name, logo_img) {
    let error = {};
    if (!name) {
        error.name = "name is required"
    }

    if (!logo_img) {
        error.logo_img = "logo image is required"
    }
    return error;
}

exports.create = async (req, res) => {
    const { name, logo_img } = req.body;
    const error = validation(name, logo_img);
    const errLength = Object.keys(error).length;

    if (errLength > 0) {
        return res.status(400).send(error);
    }

    try {
        let brand = await knex("brands").where({ name: name }).first();
        if (brand) {
            return res.status(400).json({ message: "brand exist" });
        }

        await knex("brands").insert({
            name: name,
            name_slug: slugify(name),
            logo_img: logo_img
        })
        return res.status(200).json({ message: "brand created" })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "error while creating a brand" })
    }
}

exports.getBrands = async (req, res) => {
    let brands = await knex("brands").select("*");
    return res.status(200).send(brands);
}

exports.getBrandById = async (req, res) => {
    const brandId = req.params.id;
    if(!brandId){
        return res.status(400).json({message: "brand id is missing"})
    }
    try {
        let brand = await knex("brands").where({ id: brandId }).first();
        return res.status(200).send(brand);
    } catch (error) {
        return res.status(400).json({ message: "error while parsing get brand" });
    }
}

exports.update = async (req, res) => {
    const brandId = req.params.id;
    if(!brandId){
        return res.status(400).json({message: "brand id is missing"})
    }
    const { name, logo_img } = req.body;
    const error = validation(name,logo_img);
    const errLength = Object.keys(error).length;

    if (errLength > 0) {
        return res.status(400).send(error);
    }

    let brand;
    try {
        let existingBrand = await knex("brands").where({ name: name }).first();
        if (existingBrand) {
            return res.status(400).json({ message: "brand exist" });
        }
        brand = await knex("brands").where({ id: brandId }).first();
        if (!brandId) {
            return res.status(404).json({ message: "brand not found" });
        }
        if (brand) {
            await knex("brands").where({ id: brandId }).update({
                name: name,
                name_slug: slugify(name),
                logo_img: logo_img
            });
        }
        return res.status(200).json({ message: "brand updated" });
    } catch {
        console.log(error);
        return res.status(400).json({message: "Error while updating brand"});
    }
}

exports.delete = async (req, res) => {
    let brandId = req.params.id;
    if (!brandId) {
        return res.status(400).json({ message: "brand id is missing" });
    }
    let brand;
    try {
        brand = await knex("brands").where({ id: brandId }).first();
        if (!brand) {
            return res.status(404).json({ message: "brand is not found" });
        }
        if (brand) {
            await knex("brands").where({ id: brandId }).del();
        }
        return res.status(200).json({ message: "brand deleted" });
    } catch (error) {
        return res.status(400).json({ message: "error while deleting brand" })
    }
}

