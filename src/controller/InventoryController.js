const express = require("express");
const knex = require("../../config/db");


function validation(
  staff_id,
  user_id,
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

  if(!staff_id){
    error.staff_id = "staff id required";
  }

  if(!user_id){
    error.user_id = "user id required";
  }

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

function generateInvoiceNumber() {
  const invoice_number = "INV_" + Date.now();
  console.log(invoice_number);
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


  const error = validation(
    staff_id,
    user_id,
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
  // console.log(user_id);
  // console.log(staff_id);
  // console.log(product_id);
  // console.log(supplier_id);
  
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

    await trx.commit();
    return res.status(200).json({ message: "inventory added" });
  } catch (error) {
    await trx.rollback();
    console.log(error);
    return res.status(400).json({ message: "Error while adding inventory" });
  }
};

exports.getInventory = async (req, res) => {
  let suppliers = await knex("inventory_items").select("*");
  return res.status(200).send(suppliers);
};

exports.getInventoryById = async (req, res) => {
  let inventoryId = req.params.id;

  if (!inventoryId) {
    return res.status(400).json({ message: "inventoryId is missing" });
  }

  try {
    let inventory = await knex("suppliers").where({ id: inventoryId });
    if (!inventory) {
      return res.status(404).json({ message: "inventory is not found" });
    }
    return res.status(200).send(inventory);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error while get inventory" });
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
    invoice_number,
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
    invoice_number,
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
    return res.status(400).json({ message: "inventoryId is missing" });
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
      tax_id,
      grand_total,
      payment_due_date,
      invoice_number,
      is_available,
      quantity,
      payment_type,
      order_type,
      payment_status,
      expected_arrival_date,
      actual_arrival_date
    });
    trx.commit();
    return res.status(200).json({ message: "inventory updated" });
  } catch (error) {
    trx.rollback();
    console.log(error);
    return res.status(400).json({ message: "Error while updating inventory" });
  }
};

exports.deleteById = async (req, res) => {
  const inventoryId = req.params.id;

  if (!inventoryId) {
    return res.status(400).json({ message: "inventoryId missing" });
  }

  const trx = await knex.transaction();

  try {
    const inventory = await trx("inventory")
      .where({ id: inventoryId })
      .first();

    if (!inventory) {
      await trx.rollback();
      return res.status(404).json({ message: "Inventory not found" });
    }

    await trx("inventory_items")
      .where({ inventory_id: inventoryId })  
      .del();

    await trx("inventory").where({ id: inventoryId }).del();

    await trx.commit();

    return res.status(200).json({ message: "Inventory deleted successfully" });

  } catch (error) {
    console.log(error);
    await trx.rollback();
    return res.status(500).json({
      message: "Error while deleting inventory",
      error: error.message,
    });
  }
};
