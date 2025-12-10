const express = require("express");
const knex = require("../../config/db");
const XLSX = require('xlsx');


function validation(
  product_id,
  supplier_id,
  tax_id,
  grand_total,
  payment_due_date,
  quantity,
  payment_type,
  order_type,
  payment_status,
  expected_arrival_date,
  actual_arrival_date
) {
  let error = {};



  if (!product_id) {
    error.product_id = "product id required";
  }

  if (!supplier_id) {
    error.supplier_id = "supplier id required";
  }

  if (!tax_id) {
    error.tax_id = "tax id required"
  }

  if (!grand_total) {
    error.grand_total = "grand total is required"
  }

  if (!payment_due_date) {
    error.payment_due_date = "payment due date is required"
  }

  if (!quantity) {
    error.quantity = "quantity is required";
  }

  if (!payment_type) {
    error.payment_type = "payment type is required";
  }

  if (!order_type) {
    error.order_type = "order type is required";
  }

  if (!payment_status) {
    error.payment_status = "payment status is required";
  }

  if (!expected_arrival_date) {
    error.expected_arrival_date = "expected arrival date is required";
  }

  if (!actual_arrival_date) {
    error.actual_arrival_date = "actual arrival date is required";
  }

  return error;
}

function bulkValidation(row) {
  let error = {};

  if (!row.user_id) error.user_id = "user id is required";
  if (!row.staff_id) error.staff_id = "staff id is required";
  if (!row.product_id) error.product_id = "product id is required";
  if (!row.supplier_id) error.supplier_id = "supplier id is required";

  if (!row.invoice_number) error.invoice_number = "invoice number is required";
  if (!row.quantity) error.quantity = "quantity is required";
  if (!row.tax_id) error.tax_id = "tax id is required";
  if (!row.grand_total) error.grand_total = "grand total is required";
  if (!row.payment_due_date) error.payment_due_date = "payment due date is required";
  if (!row.payment_type) error.payment_type = "payment type is required";
  if (!row.order_type) error.order_type = "order type is required";
  if (!row.payment_status) error.payment_status = "payment status is required";
  if (!row.expected_arrival_date) error.expected_arrival_date = "expected arrival date is required";
  if (!row.actual_arrival_date) error.actual_arrival_date = "actual arrival date is required";

  return error;
}

function generateInvoiceNumber() {
  const invoice_number = "INV_" + Date.now();
  return invoice_number;
}

exports.addInventory = async (req, res) => {
  const staff_id = req.user.id;

  const {
    user_id,
    product_id,
    supplier_id,
    tax_id,
    grand_total,
    payment_due_date,
    is_available,
    quantity,
    payment_type,
    order_type,
    payment_status,
    expected_arrival_date,
    actual_arrival_date,
  } = req.body;

  if (!staff_id) {
    error.staff_id = "staff id required";
  }

  if (!user_id) {
    error.user_id = "user id required";
  }

  const error = validation(
    product_id,
    supplier_id,
    tax_id,
    grand_total,
    payment_due_date,
    quantity,
    payment_type,
    order_type,
    payment_status,
    expected_arrival_date,
    actual_arrival_date
  );


  const trx = await knex.transaction();

  const errLength = Object.keys(error).length;
  if (errLength > 0) {
    return res.status(400).send(error);
  }

  try {
    let [inventory_id] = await trx("inventory").insert({
      user_id: user_id,
      staff_id: staff_id,
      product_id: product_id,
      supplier_id: supplier_id,
    });
    let invoice_number = generateInvoiceNumber();


    await trx("inventory_items").insert({
      inventory_id: inventory_id,
      invoice_number: invoice_number,
      is_available: is_available,
      quantity: quantity,
      tax_id: tax_id,
      grand_total: grand_total,
      payment_due_date: payment_due_date,
      payment_type: payment_type,
      order_type: order_type,
      payment_status: payment_status,
      expected_arrival_date: expected_arrival_date,
      actual_arrival_date: actual_arrival_date,
    });

    await trx("stocks as s")
      .where("s.product_id", product_id)
      .increment("s.quantity", quantity);

    await trx.commit();
    return res.status(200).json({ message: "inventory added" });
  } catch (error) {
    await trx.rollback();
    console.log(error);
    return res.status(400).json({ message: "error while adding inventory" });
  }
};

exports.getInventory = async (req, res) => {
  let suppliers = await knex("inventory_items").select("*");
  return res.status(200).send(suppliers);
};

exports.getInventoryById = async (req, res) => {
  let inventoryId = req.params.id;

  if (!inventoryId) {
    return res.status(400).json({ message: "inventory id is missing" });
  }

  try {
    let inventory = await knex("suppliers").where({ id: inventoryId });
    if (!inventory) {
      return res.status(404).json({ message: "inventory is not found" });
    }
    return res.status(200).send(inventory);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "error while get inventory" });
  }
};

exports.updateInventory = async (req, res) => {
  let inventoryId = req.params.id;

  const {
    product_id,
    supplier_id,
    tax_id,
    grand_total,
    payment_due_date,
    is_available,
    quantity,
    payment_type,
    order_type,
    payment_status,
    expected_arrival_date,
    actual_arrival_date,
  } = req.body;

  const error = validation(
    product_id,
    supplier_id,
    tax_id,
    grand_total,
    payment_due_date,
    quantity,
    payment_type,
    order_type,
    payment_status,
    expected_arrival_date,
    actual_arrival_date
  );
  const errLength = Object.keys(error).length;
  if (errLength > 0) {
    return res.status(400).send(error);
  }
  const trx = await knex.transaction();

  if (!inventoryId) {
    return res.status(400).json({ message: "inventory id is missing" });
  }

  try {
    let inventory = await trx("inventory").where({ id: inventoryId }).first();
    if (!inventory) {
      return res.status(404).json({ message: "inventory is not found" });
    }
    await trx("inventory").where({ id: inventoryId }).update({
      product_id: product_id,
      supplier_id: supplier_id,
    });
    await trx("inventory_items").where({ id: inventoryId }).update({
      tax_id: tax_id,
      grand_total: grand_total,
      payment_due_date: payment_due_date,
      is_available: is_available,
      quantity: quantity,
      payment_type: payment_type,
      order_type: order_type,
      payment_status: payment_status,
      expected_arrival_date: expected_arrival_date,
      actual_arrival_date: actual_arrival_date,
    });

    await trx("stocks as s")
      .where("s.product_id", product_id)
      .increment("s.quantity", quantity);

    trx.commit();
    return res.status(200).json({ message: "inventory updated" });
  } catch (error) {
    trx.rollback();
    console.log(error);
    return res.status(400).json({ message: "error while updating inventory" });
  }
};

exports.deleteById = async (req, res) => {
  const inventoryId = req.params.id;

  if (!inventoryId) {
    return res.status(400).json({ message: "inventory id is missing" });
  }

  const trx = await knex.transaction();

  try {
    const inventory = await trx("inventory")
      .where({ id: inventoryId })
      .first();

    if (!inventory) {
      await trx.rollback();
      return res.status(404).json({ message: "inventory not found" });
    }

    await trx("inventory_items")
      .where({ inventory_id: inventoryId })
      .del();

    await trx("inventory").where({ id: inventoryId }).del();

    await trx.commit();

    return res.status(200).json({ message: "inventory deleted successfully" });

  } catch (error) {
    console.log(error);
    await trx.rollback();
    return res.status(500).json({
      message: "Error while deleting inventory",
      error: error.message,
    });
  }
};

exports.bulkUpload = async (req, res) => {
  if (!req.file) {
    return res.status(404).json({ message: "Excel file is missing" });
  }

 try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const workSheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(workSheet);

    let validationErrors = [];
    rows.forEach((row, idx) => {
      const errors = bulkValidation(row);
      if (Object.keys(errors).length > 0) {
        validationErrors.push({ row: idx + 1, errors });
      }
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        validationErrors,
      });
    }

    const trx = await knex.transaction();

    try {
      for (const row of rows) {
        const [inventory_id] = await trx("inventory").insert({
          user_id: row.user_id,
          staff_id: row.staff_id,
          product_id: row.product_id,
          supplier_id: row.supplier_id
        });

        await trx("inventory_items").insert({
          inventory_id: inventory_id,
          invoice_number: row.invoice_number,
          is_available: row.is_available,
          quantity: row.quantity,
          tax_id: row.tax_id,
          grand_total: row.grand_total,
          payment_due_date: row.payment_due_date,
          payment_type: row.payment_type,
          order_type: row.order_type,
          payment_status: row.payment_status,
          expected_arrival_date: row.expected_arrival_date,
          actual_arrival_date: row.actual_arrival_date
        });

      
        await trx("stocks")
          .where("product_id", row.product_id)
          .increment("quantity", row.quantity);
      }

      await trx.commit();
      return res.status(200).json({ message: "Inventory imported successfully" });

    } catch (err) {
      await trx.rollback();
      console.log(err);
      return res.status(500).json({ message: "Error inserting data", error: err.message });
    }

  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error while import inventory", error });
  }
};

exports.exportInventory = async (req, res) => {
  if (!req.body) {
    return res.status(404).json({ message: "req cant't be empty" })
  }
  try {
    const inventories = await knex("inventory as i")
      .leftJoin("inventory_items as inv", "inv.inventory_id", "i.id")
      .select(
        "i.user_id",
        "i.staff_id",
        "i.product_id",
        "i.supplier_id",
        "inv.inventory_id",
        "inv.invoice_number",
        "inv.is_available",
        "inv.quantity",
        "inv.tax_id",
        "inv.grand_total",
        "inv.payment_due_date",
        "inv.payment_type",
        "inv.order_type",
        "inv.payment_status",
        "inv.expected_arrival_date",
        "inv.actual_arrival_date"
      );

    const worksheet = XLSX.utils.json_to_sheet(inventories);

    const workbook = XLSX.utils.book_new();

    const beforeBuffer = XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventories');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader("Content-Disposition", "attachment; filename=inventories.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    return res.send(buffer);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error exporting inventories', error });
  }
}

exports.filterInventoryByPaymentStatus = async (req, res) => {
  const { payment_status } = req.body;
  try {
    let inventoryByPaymentStatus = await knex("inventory_items").where({ payment_status: payment_status }).first();
    if (!inventoryByPaymentStatus) {
      return res.status(404).json({ message: "not found" })
    }
    return res.status(200).send(inventoryByPaymentStatus);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "error while filtering Payment Status" })
  }
}

/*

function bulkValidation(row) {
  let error = {};

  if (!row.user_id) error.user_id = "user_id is required";
  if (!row.staff_id) error.staff_id = "staff_id is required";
  if (!row.product_id) error.product_id = "product_id is required";
  if (!row.supplier_id) error.supplier_id = "supplier_id is required";

  if (!row.invoice_number) error.invoice_number = "invoice_number is required";
  if (!row.quantity) error.quantity = "quantity is required";
  if (!row.tax_id) error.tax_id = "tax_id is required";
  if (!row.grand_total) error.grand_total = "grand_total is required";
  if (!row.payment_due_date) error.payment_due_date = "payment_due_date is required";
  if (!row.payment_type) error.payment_type = "payment_type is required";
  if (!row.order_type) error.order_type = "order_type is required";
  if (!row.payment_status) error.payment_status = "payment_status is required";
  if (!row.expected_arrival_date) error.expected_arrival_date = "expected_arrival_date is required";
  if (!row.actual_arrival_date) error.actual_arrival_date = "actual_arrival_date is required";

  return error;
}

exports.bulkUpload = async (req, res) => {
  if (!req.file) {
    return res.status(404).json({ message: "Excel file is missing" });
  }

  


*/