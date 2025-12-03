const express = require("express");
const knex = require("../../config/db");

function validation(
  user_id,
  products,
  staff_id,
  discount,
  tax_id,
  payment_id,
  is_paid
) {
  let error = {};

  if (!user_id) {
    error.user_id = "user_id required";
  }

  if (products.length != 0) {
    error.products = "Atleast 1 item needed to be in product";
  }

  if (!staff_id) {
    error.staff_id = "staff_id required";
  }

  if (!discount) {
    error.discount = "discount required";
  }

  if (!tax_id) {
    error.tax_id = "tax_id required";
  }

  if (!payment_id) {
    error.tax_id = "payment_id required";
  }

  if (!is_paid) {
    error.is_paid = "is_paid required";
  }

  return error;
}

function generateInvoiceNumber() {
  const invoice_number = "INV_" + knex.fn.now();
  console.log(invoice_number);
  return invoice_number;
}

exports.create = async (req, res) => {
  const staff_id = req.user.id;
  const { user_id, products, discount, tax_id, payment_id, is_paid } = req.body;

  const error = validation(
    user_id,
    products,
    staff_id,
    discount,
    tax_id,
    payment_id,
    is_paid
  );

  const errLength = Object.keys(error).length;
  if (errLength > 0) {
    return res.status(400).send(error);
  }

  const quantity = products.reduce((acc, product) => acc + product.quantity, 0);
  const subTotal = products.reduce(
    (acc, product) => acc + product.quantity * product.price,
    0
  );
  const discountAmount = (discount / 100) * subTotal;
  const tax_percent = await knex("order as o")
    .leftJoin("tax as t", "o.id", "t.id")
    .where("t.id", tax_id)
    .select("t.percent");
  console.log("tax amount", tax_amount);
  const tax_amount = (tax_percent / 100) * subTotal;

  const grand_total = subTotal + tax_amount - discountAmount;
  const invoice_number = generateInvoiceNumber();

  try {
    const [orderId] = await knex("orders").insert({
      invoice_number: invoice_number,
      user_id: user_id,
      staff_id: staff_id,
      discount: discount,
      quantity: quantity,
      subTotal: subTotal,
      tax_id: tax_id,
      tax_percent: tax_percent,
      tax_amount: tax_amount,
      payment_id: payment_id,
      is_paid: is_paid,
      grand_total: grand_total,
    });
    let order_items = products.map((product) => ({
      product_id: product.id,
      order_id: orderId,
      quantity: product.quantity,
      price: product.price,
      subTotal: product.subTotal,
    }));
    await knex("order_items").insert(order_items);
    return res.status(200).json({ message: "Order Added" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error while add order" });
  }
};
