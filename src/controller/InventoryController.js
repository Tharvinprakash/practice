const express = require("express");
const knex = require("../../config/db");

function validation(
  product_id,
  supplier_id,
  //   inventory_id,
  invoice_number,
  is_available,
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

  //   if (!inventory_id) {
  //     error.inventory_id = "inventory id required";
  //   }

  //   if (!invoice_number) {
  //     error.invoice_number = "invoice number is required";
  //   }

  if (!is_available) {
    error.is_available = "is available is required";
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
}

function generateInvoiceNumber() {
  const invoice_number = "INV_" + Date.now();
  console.log(invoice_number);
  return invoice_number;
}

exports.addInventory = async (req, res) => {
  const {
    product_id,
    supplier_id,
    // inventory_id,
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
    // inventory_id,
    invoice_number,
    is_available,
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
      product_id: product_id,
      supplier_id: supplier_id,
    });
    let invoice_number;

    if (invoice_number === undefined || !invoice_number) {
      invoice_number = generateInvoiceNumber();
    }

    await trx("inventory_items").insert({
      inventory_id: inventory_id,
      invoice_number: invoice_number,
      is_available: is_available,
      quantity: quantity,
      payment_type: payment_type,
      order_type: order_type,
      payment_status: payment_status,
      expected_arrival_date: expected_arrival_date,
      actual_arrival_date: actual_arrival_date,
    });

    trx.commit();
    return res.status(200).json({ message: "inventory added" });
  } catch (error) {
    await trx.rollback();
    console.log(error);
    return res.status(400).json({ message: "Error while adding inventory" });
  }
};

exports.getInventory = async (req, res) => {
  let suppliers = await knex("suppliers").select("*");
  return res.status(200).send(suppliers);
};

exports.getInventoryById = async (req, res) => {
  let supplierId = req.params.id;

  if (!supplierId) {
    return res.status(400).json({ message: "supplierId is missing" });
  }

  try {
    let supplier = await knex("suppliers").where({ id: supplierId });
    if (!supplier) {
      return res.status(404).json({ message: "supplier is not found" });
    }
    return res.status(200).send(supplier);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error while get supplier" });
  }
};

exports.updateInventory = async (req, res) => {
  let supplierId = req.params.id;

  const {
    name,
    phone_no,
    email,
    address,
    city,
    state,
    gst_number,
    referred_staff,
    created_by,
    updated_by,
  } = req.body;

  const error = validation(
    name,
    phone_no,
    email,
    address,
    city,
    state,
    gst_number,
    referred_staff,
    created_by,
    updated_by
  );
  const errLength = Object.keys(error).length;
  if (errLength > 0) {
    return res.status(400).send(error);
  }

  if (!supplierId) {
    return res.status(400).json({ message: "supplierId is missing" });
  }

  try {
    let supplier = await knex("suppliers").where({ id: supplierId }).first();
    if (!supplier) {
      return res.status(404).json({ message: "supplier is not found" });
    }
    await knex("suppliers").where({ id: unitId }).update({
      name: name,
      phone_no: phone_no,
      email: email,
      address: address,
      city: city,
      state: state,
      gst_number: gst_number,
      referred_staff: referred_staff,
      created_by: created_by,
      updated_by: updated_by,
    });
    return res.status(200).json({ message: "supplier updated" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error while updating supplier" });
  }
};

exports.deleteById = async (req, res) => {
  let supplierId = req.params.id;
  if (!supplierId) {
    return res.status(400).json({ message: "supplierId missing" });
  }
  let supplier;
  try {
    supplier = await knex("suppliers").where({ id: supplierId }).first();
    if (!supplier) {
      return res.status(404).json({ message: "supplier is not found" });
    }
    if (supplier) {
      await knex("suppliers").where({ id: supplierId }).del();
    }
    return res.status(200).json({ message: "supplier deleted" });
  } catch (error) {
    return res.status(400).json({ message: "error while deleting supplier" });
  }
};
