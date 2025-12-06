const express = require("express");
const knex = require("../../config/db");
const jwt = require('jsonwebtoken');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
require("dotenv").config();

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
    if (!product.id) {
      error.id = "product id required";
    }

    if (product.name.length < 2) {
      error.name = "product name length atleast 2";
    }

    if (!product.quantity) {
      error.quantity = "product quantity required";
    }

    if (!product.price) {
      error.price = "product price required";
    }
    // await knex("products").where({})
    // if(product.price ){
    // }

    if (!product.subTotal) {
      error.subTotal = "product subTotal required";
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

function generateToken(user_id,order_id){
    const token = jwt.sign({
        user_id: user_id,
        order_id: order_id
    },
    process.env.JWT_SECRET,{
        expiresIn : '24h'
    }
    );
    return token;
}


exports.create = async (req, res) => {
  // console.log(req.user)
  const staff_id = req.user.id;
  // console.log(staff_id)
  const { user_id, products, discount, tax_id, payment_id, is_paid,payment_mode_id } = req.body;
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
  const taxRow = await trx("tax").where({ id: tax_id }).first();
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
      subTotal: product.subTotal,
    }));

    await trx("order_items").insert(order_items);

    if (!grand_total || isNaN(grand_total) || grand_total <= 0) {
      return res.status(400).json({ message: "amount is invalid" });
    }

    const token = generateToken(user_id, orderId);

    const amountInCents = Math.round(grand_total * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `Order #${orderId}` },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        user_id,
        orderId,
      },
      success_url: `http://localhost:3000/stripe-payment/payment-success?token=${token}`,
      cancel_url: "http://localhost:3000/stripe-payment/payment-failed",
    });
    console.log(session);
    console.log("\nsessionId\n",session.id);

    await trx("payment_transactions").insert({
      order_id: orderId,
      payment_mode_id: payment_mode_id,
      paid_at: trx.fn.now(),
      closed_at: trx.fn.now()
    })
    await trx.commit();
    return res.status(200).send(session.url);
  } catch (error) {
    await trx.rollback();
    console.log(error);
    return res.status(400).json({ message: "Error while add order" });
  }
};

