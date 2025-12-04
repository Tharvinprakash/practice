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

  if (products.length === 0) {
    error.products = "Atleast 1 item needed to be in product";
  }

  products.map((product) => {
    if(!product.id){
      error.id = "product id required"
    }

    if(product.name.length < 2){
      error.name = "product name length atleast 2"
    }

    if(!product.quantity){
      error.quantity = "product quantity required"
    }

    if(!product.price){
      error.price = "product price required"
    }
    // await knex("products").where({})
    // if(product.price ){

    // }

    if(!product.subTotal){
      error.subTotal = "product subTotal required"
    }

  });

  if (!staff_id) {
    error.staff_id = "staff_id required";
  }

  if (discount === undefined) {
    error.discount = "discount required";
  }

  if (tax_id === undefined) {
    error.tax_id = "tax_id required";
  }

  if (payment_id === undefined) {
    error.tax_id = "payment_id required";
  }

  if (is_paid === undefined) {
    error.is_paid = "is_paid required";
  }

  return error;
}

function generateInvoiceNumber() {
  const invoice_number = "INV_" + Date.now();
  console.log(invoice_number);
  return invoice_number;
}

exports.create = async (req, res) => {
  // console.log(req.user)
  const staff_id = req.user.id;
  // console.log(staff_id)
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
  const trx = await knex.transaction();

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
  const taxRow = await trx("tax").where({id: tax_id}).first(); 
  console.log("tax row", taxRow);
  const tax_amount = (taxRow.percent / 100) * subTotal;
  console.log("tax_amount", tax_amount);

  const grand_total = subTotal + tax_amount - discountAmount;
  const invoice_number = generateInvoiceNumber();


  try {
    const [orderId] = await trx("orders").insert({
      invoice_number: invoice_number,
      user_id: user_id,
      staff_id: staff_id,
      discount: discount,
      quantity: quantity,
      subTotal: subTotal,
      tax_id: tax_id,
      tax_percent: taxRow.percent,
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
      subTotal: product.subTotal
    }));
    await trx("order_items").insert(order_items);
    await trx.commit()
    return res.status(200).json({ message: "Order Added" });
  } catch (error) {
    await trx.rollback()
    console.log(error);
    return res.status(400).json({ message: "Error while add order" });
  }
};
