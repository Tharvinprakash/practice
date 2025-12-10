const express = require('express');
const knex = require('../../config/db');
const slugify = require('slugify');
const XLSX = require('xlsx');

function validation(name, image, description, marked_price, purchased_price,
    selling_price, category, ratings, reviews) {

    let error = {};

    if (name.length < 2) {
        error.name = "name length atleast 2";
    }

    if (!image) {
        error.image = "image url cant be empty";
    }

    if (description.length < 15) {
        error.password = "description length atleast 15";
    }

    if (!marked_price) {
        error.marked_price = "marked price can't be empty";
    }

    if (!purchased_price) {
        error.purchased_price = "purchased price can't be empty";
    }

    if (!selling_price) {
        error.selling_price = "selling price can't be empty";
    }

    if (!category) {
        error.category = "category can't be empty";
    }

    if (ratings.length < 0) {
        error.ratings = "ratings can't be empty";
    }

    if (reviews < 0) {
        error.reviews = "reviews can't be empty";
    }

    return error;
}


exports.uploadCheck = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "upload file is missing" })
    }

    const imgUrl = `/uploads/${req.file.filename}`

    return res.status(200).json({
        url: imgUrl
    });
}

exports.addProduct = async (req, res) => {

    const { name, image, description, marked_price, purchased_price,
        selling_price, category, is_active, is_delete, ratings, reviews
    } = req.body;

    const error = validation(name, image, description, marked_price, purchased_price,
        selling_price, category, is_active, is_delete, ratings, reviews);

    const errLength = Object.keys(error).length;
    if (errLength > 0) {
        return res.status(400).send(error);
    }

    try {
        let product = await knex("products").where({ name: name }).first();
        if (product) {
            return res.status(400).json({ message: "product exist" });
        }
        if (!product) {
            await knex("products").insert({
                name: name,
                name_slug: slugify(name),
                image: image,
                description: description,
                marked_price: marked_price,
                purchased_price: purchased_price,
                selling_price: selling_price,
                category: category,
                is_active: is_active,
                is_delete: is_delete,
                ratings: ratings,
                reviews: reviews,
            });
        }
        return res.status(201).json({ message: "product created" })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "error while creating a product" })
    }
}

exports.getProduct = async (req, res) => {
    let products = await knex("products").select("*")
    return res.send(products);
}

exports.getProductById = async (req, res) => {
    let productId = req.params.id;
    if (!productId) {
        return res.status(400).json({ message: "product id is missing" });
    }
    let product;
    try {
        product = await knex("products").where({ id: productId }).first();
        return res.status(200).send(product);
    } catch (error) {
        return res.status(400).json({ message: "error while parsing get product" });

    }
}

exports.updateProduct = async (req, res) => {
    const productId = req.params.id;
    if (!productId) {
        return res.status(400).json({ message: "product id is  missing" });
    }
    const { name, image, description, marked_price, purchased_price,
        selling_price, category, is_active, is_delete, ratings, reviews } = req.body;

    const error = validation(name, image, description, marked_price, purchased_price,
        selling_price, category, is_active, is_delete, ratings, reviews);

    const errLength = Object.keys(error).length;
    if (errLength > 0) {
        return res.status(400).send(error);
    }
    let product;
    try {
        let existingProduct = await knex("products").where({ name: name }).first();
        if (existingProduct) {
            return res.status(400).json({ message: "product exist" });
        }
        product = await knex("products").where({ id: productId }).first();
        if (!productId) {
            return res.status(404).json({ message: "product not found" });
        }
        if (product) {
            await knex("products").where({ id: productId }).update({
                name: name,
                name_slug: slugify(name),
                image: image,
                description: description,
                marked_price: marked_price,
                purchased_price: purchased_price,
                selling_price: selling_price,
                category: category,
                is_active: is_active,
                is_delete: is_delete,
                ratings: ratings,
                reviews: reviews
            });
        }
        return res.status(200).json({ message: "product updated" });
    } catch (error) {
        return res.status(400).json({ message: "error while updating product" });
    }
}

exports.deleteById = async (req, res) => {
    let productId = req.params.id;
    if (!productId) {
        return res.status(400).json({ message: "product id is missing" });
    }
    let product;
    try {
        product = await knex("products").where({ id: productId }).first();
        if (!product) {
            return res.status(404).json({ message: "product is not found" });
        }
        if (product) {
            await knex("products").where({ id: productId }).del();
        }
        return res.status(200).json({ message: "product deleted" });
    } catch (error) {
        return res.status(400).json({ message: "error while deleting product" })
    }
}

exports.filterByCategory = async (req, res) => {
    let categoryName = req.params.name;

    let category;
    try {
        category = await knex("products as p")
            .leftJoin("categories as c", "p.category", "c.id")
            .where("c.name", categoryName)
            .select("*")
        console.log(category);
        if (!category) {
            return res.status(404).json({ message: "No items in this category" });
        }
        return res.status(200).send(category);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error while filtering category" });
    }
}

exports.searchProduct = async (req, res) => {
    const productName = req.params.name;
    console.log(productName)
    let product;
    try {
        product = await knex("products")
            .where('name', 'like', `%${productName.toLowerCase()}%`)
            .select("*");
        if (product.length == 0) {
            return res.status(404).json({ message: "No search result" });
        }
        return res.status(200).send(product);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error while searching product" });
    }
}

exports.pagination = async (req, res) => {

    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);

    if (!page) {
        let defaultPage = 1;
        page = Math.max(page, defaultPage);
    }

    const defaultLimit = 5;
    limit = Math.min(limit, defaultLimit);


    try {
        let products = await knex('products').paginate({ perPage: limit, currentPage: page });
        if (!products) {
            return res.status(404).json({ message: "products not found" });
        }
        return res.status(200).send(products);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error while pagination on products" })
    }

}

exports.sortByProductName = async (req, res) => {
    let op = (req.params.asc).toLowerCase();
    console.log(op);
    if (op != 'asc' && op != 'desc') {
        op = 'asc';
    }
    try {
        let products = await knex("products").select("*")
            .orderBy('name', `${op}`);
        console.log(products);
        return res.status(200).send(products);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error while sorting" });
    }
}

exports.bulkUpload = async (req, res) => {
    if (!req.file) {
        return res.status(404).json({ message: "Excel file is missing" });
    }

    try {
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const workSheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(workSheet);

        let validationErrors = [];

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let errors = {};

            if (!row.name) errors.name = "name is required";
            if (!row.name_slug) errors.name_slug = "name_slug is required";
            if (!row.description) errors.description = "description is required";
            if (!row.marked_price) errors.marked_price = "marked_price is required";
            if (!row.purchased_price) errors.purchased_price = "purchased_price is required";
            if (!row.selling_price) errors.selling_price = "selling_price is required";
            if (!row.brand_id) errors.brand_id = "brand_id is required";
            if (row.is_active === undefined) errors.is_active = "is_active is required";
            if (row.is_delete === undefined) errors.is_delete = "is_delete is required";
            if (!row.ratings && row.ratings !== 0) errors.ratings = "ratings is required";
            if (!row.reviews) errors.reviews = "reviews is required";

            if (Object.keys(errors).length > 0) {
                validationErrors.push({ row: i + 1, errors });
            }
        }

        if (validationErrors.length > 0) {
            return res.status(400).json({
                message: "Validation failed",
                validationErrors
            });
        }

        const products = rows.map(row => ({
            name: row.name,
            name_slug: row.name_slug,
            description: row.description,
            marked_price: row.marked_price,
            purchased_price: row.purchased_price,
            selling_price: row.selling_price,
            brand_id: row.brand_id,
            is_active: row.is_active,
            is_delete: row.is_delete,
            ratings: row.ratings,
            reviews: row.reviews
        }));

        await knex.transaction(async trx => {
            for (const product of products) {
                await trx("products").insert(product);
            }
        });

        return res.status(200).json({ message: "Products imported successfully" });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Error while importing products",
            error
        });
    }
};



exports.exportProducts = async (req, res) => {
    if (!req.body) {
        return res.status(404).json({ message: "req cant't be empty" })
    }
    try {
        const products = await knex("products as p")
            .select(
                "p.name",
                "p.name_slug",
                "p.description",
                "p.marked_price",
                "p.purchased_price",
                "p.selling_price",
                "p.brand_id",
                "p.is_active",
                "p.is_delete",
                "p.ratings",
                "p.ratings",
                "p.reviews"
            );

        const worksheet = XLSX.utils.json_to_sheet(products);

        const workbook = XLSX.utils.book_new();

        const beforeBuffer = XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader("Content-Disposition", "attachment; filename=products.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        return res.send(buffer);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error exporting products', error });
    }
}



