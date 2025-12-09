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


    // if (typeof is_active !== "boolean") {
    //     error.is_active = "is active must be true or false";
    // }

    // if (typeof is_delete !== "boolean") {
    //     error.is_delete = "is delete must be true or false";
    // }

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
    console.log("request", req.body)
    // console.log("request image",req.image);
    // console.log("request file", req.image);
    // console.log("request file.filename",req.file.filename);


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
        console.log("product", product);
        if (product) {
            return res.status(400).json({ message: "product exist" });
        }
        if (!product) {
            console.log(name, slugify(name), image, description, marked_price, purchased_price,
                selling_price, category, is_active, is_delete, ratings, reviews);
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
        return res.status(400).json({ message: "productId missing" });
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
    const { name, image, description, marked_price, purchased_price,
        selling_price, category, stock, is_active, is_delete, ratings, reviews } = req.body;

    const error = validation(name, image, description, marked_price, purchased_price,
        selling_price, category, stock, is_active, is_delete, ratings, reviews);

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
                stock: stock,
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
        return res.status(400).json({ message: "productId missing" });
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
        // console.log(product);
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
    // console.log(req.file)
    if (!req.file) {
        return res.status(404).json({ message: "Excel file is missing" });
    }

    try {
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        // console.log("workbook", workbook);

        const sheetName = workbook.SheetNames[0];
        // console.log("sheetName", sheetName);

        const workSheet = workbook.Sheets[sheetName];
        // console.log("workSheet", workSheet);

        const data = XLSX.utils.sheet_to_json(workSheet);
        // console.log("data", data);

        const products = data.map((row) => ({
            name: row["name"] || row["Name"],
            name_slug: row["name_slug"] || null,
            image: row["image"] || '',
            description: row["description"] || '',
            marked_price: row["marked_price"] || 0,
            purchased_price: row["purchased_price"] || 0,
            selling_price: row["selling_price"] || 0,
            category: row["category"] || 1,
            brand_id: row["brand_id"] || 0,
            is_active: row["is_active"] !== undefined ? row["is_active"] : 1,
            is_delete: row["is_delete"] !== undefined ? row["is_delete"] : 0,
            ratings: row["ratings"] || null,
            reviews: row["reviews"] || null
        }));


        await knex.transaction(async (trx) => {
            for (const product of products) {
                await trx("products").insert(product);
            }
        })

        return res.status(200).json({ message: "Product imported successfully" });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error while import product", error });

    }
}

exports.exportProducts = async (req, res) => {
    if (!req.body) {
        return res.status(404).json({ message: "req cant't be empty" })
    }
    try {
        const products = await knex("products as p")
            .leftJoin("categories as c", "c.id", "p.category")
            .leftJoin("inventory as i", "i.product_id", "p.id")
            .leftJoin("suppliers as su", "su.id", "i.supplier_id")
            .leftJoin("stocks as s", "s.product_id", "p.id")
            .select(
                "p.name",
                "p.name_slug",
                "p.description",
                "p.marked_price",
                "p.purchased_price",
                "p.selling_price",
                "c.id as category_id",
                "p.brand_id",
                "s.quantity as stock_quantity",
                "su.id as supplier_id",
                "p.is_active",
                "p.is_delete",
                "p.ratings",
                "p.ratings",
                "p.reviews"
            );

        const worksheet = XLSX.utils.json_to_sheet(products);
        // console.log("worksheet",worksheet);

        const workbook = XLSX.utils.book_new();
        // console.log("workbook",workbook);

        const beforeBuffer = XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
        // console.log("beforeBuffer",beforeBuffer);

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        // console.log("buffer",buffer);

        res.setHeader("Content-Disposition","attachment; filename=products.xlsx");
        res.setHeader("Content-Type","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        return res.send(buffer);    

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error exporting products', error });
    }
}



