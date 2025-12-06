const express = require('express');
const knex = require('../../config/db');


function validation(unit_name, name) {
    let error = {};

    if (!unit_name) {
        error.unit_name = "unit name required"
    }

    if (!name) {
        error.name = "name required"
    }

    return error;
}

exports.addUnit = async (req, res) => {
    const { unit_name, name } = req.body;

    const error = validation(unit_name, name);
    const errLength = Object.keys(error).length;
    if (errLength > 0) {
        return res.status(400).send(error);
    }
    try {
        let unit = await knex("units").where({ unit_name: unit_name }).first();
        if (unit) {
            return res.status(400).json({ message: "unit already exists" });
        }
        await knex("units").insert({
            unit_name: unit_name,
            name: name
        });
        return res.status(200).json({ message: "unit added" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error while adding unit" });
    }
}

exports.getUnits = async (req, res) => {
    let units = await knex("units").select("*");
    return res.status(200).send(units);
}

exports.getUnitById = async (req, res) => {
    let unitId = req.params.id;

    if (!unitId) {
        return res.status(400).json({ message: "unitId is missing" });
    }

    try {
        let unit = await knex("units").where({ id: unitId });
        if (!unit) {
            return res.status(404).json({ message: "unit is not found" })
        }
        return res.status(200).send(unit);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error while get unit" });
    }
}

exports.updateUnit = async (req, res) => {
    let unitId = req.params.id;

    const { unit_name, name } = req.body;

    const error = validation(unit_name, name);
    const errLength = Object.keys(error).length;
    if (errLength > 0) {
        return res.status(400).send(error);
    }

    if (!unitId) {
        return res.status(400).json({ message: "unitId is missing" });
    }

    try {
        let unit = await knex("units").where({ id: unitId }).first();
        if (!unit) {
            return res.status(404).json({ message: "unit is not found" })
        }
        await knex("units").where({id: unitId}).update({
            unit_name: unit_name,
            name: name
        });
        return res.status(200).json({message: "unit updated"});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Error while updating unit"});
    }
}

exports.deleteById = async (req, res) => {
    let unitId = req.params.id;
    if (!unitId) {
        return res.status(400).json({ message: "unitId missing" });
    }
    let unit;
    try {
        unit = await knex("units").where({ id: unitId }).first();
        if (!unit) {
            return res.status(404).json({ message: "unit is not found" });
        }
        if (unit) {
            await knex("products").where({ id: taxId }).del();
        }
        return res.status(200).json({ message: "unit deleted" });
    } catch (error) {
        return res.status(400).json({ message: "error while deleting unit" })
    }
}