const express = require("express");
const knex = require("../../config/db");
const jwt = require("jsonwebtoken");
const XLSX = require('xlsx');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
require("dotenv").config();

function validation(
  user_id,
  products,
  staff_id,
  discount,
  tax_id,
  payment_id,
  order_status
) {
  let error = {};

  if (!user_id) {
    error.user_id = "user id required";
  }

  if (products.length === 0) {
    error.products = "atleast 1 item needed to be in product";
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

    if (!product.subTotal) {
      error.subTotal = "product subTotal required";
    }
  });

  if (!staff_id) {
    error.staff_id = "staff id required";
  }

  if (discount === undefined) {
    error.discount = "discount required";
  }

  if (tax_id === undefined) {
    error.tax_id = "tax id required";
  }

  if (payment_id === undefined) {
    error.tax_id = "payment id required";
  }

  if (!order_status) {
    error.order_status = "order status is required";
  }

  return error;
}

function bulkValidation(row) {
  let error = {};

  if (!row.user_id) error.user_id = "user_id is required";
  if (!row.staff_id) error.staff_id = "staff_id is required";
  if (row.discount === undefined) error.discount = "discount is required";
  if (!row.tax_id) error.tax_id = "tax_id is required";
  if (!row.payment_id) error.payment_id = "payment_id is required";
  if (!row.order_status) error.order_status = "order_status is required";

  let products;
  try {
    products = JSON.parse(row.products);
  } catch {
    error.products = "products must be a valid JSON array string";
    return error;
  }

  if (!Array.isArray(products) || products.length === 0) {
    error.products = "at least 1 product is required";
    return error;
  }

  products.forEach((p, idx) => {
    if (!p.id) error[`product_${idx}_id`] = "product id required";
    if (!p.name || p.name.length < 2)
      error[`product_${idx}_name`] = "product name must be min 2 chars";
    if (!p.quantity) error[`product_${idx}_qty`] = "quantity required";
    if (!p.price) error[`product_${idx}_price`] = "price required";
  });

  return error;
}


function generateInvoiceNumber() {
  const invoice_number = "INV_" + Date.now();
  return invoice_number;
}

function generateToken(user_id, order_id) {
  const token = jwt.sign(
    {
      user_id: user_id,
      order_id: order_id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
  return token;
}

exports.create = async (req, res) => {
  const staff_id = req.user.id;
  const {
    user_id,
    products,
    discount,
    tax_id,
    payment_id,
    payment_mode_id,
    order_status,
  } = req.body;
  const error = validation(
    user_id,
    products,
    staff_id,
    discount,
    tax_id,
    payment_id,
    order_status
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
  const tax_amount = (taxRow.percent / 100) * subTotal;

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
      is_paid: "unpaid",
      order_status: order_status,
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

    await trx("payment_transactions").insert({
      order_id: orderId,
      payment_mode_id: payment_mode_id,
      paid_at: trx.fn.now(),
      closed_at: trx.fn.now(),
    });

    for (const product of products) {
      let existingProduct = await trx("stocks")
        .where("product_id", product.id)
        .first();

      if (!existingProduct) {
        await trx.rollback();
        return res
          .status(404)
          .json({ message: `product not found ${product.id}` });
      }

      if (existingProduct.quantity < product.quantity) {
        await trx.rollback();
        return res.status(400).json({ message: "stock is low" });
      }

      await trx("stocks")
        .where("product_id", product.id)
        .update({
          quantity: existingProduct.quantity - product.quantity,
        });
    }

    await trx.commit();
    return res.status(200).send(session.url);
  } catch (error) {
    await trx.rollback();
    console.log(error);
    return res.status(400).json({ message: "Error while add order" });
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

    if (rows.length === 0) {
      return res.status(400).json({ message: "Excel file is empty" });
    }

    const ordersMap = {};

    for (const row of rows) {
      const key = `${row.user_id}_${row.staff_id}_${row.tax_id}_${row.discount}_${row.payment_id}_${row.order_status}`;

      if (!ordersMap[key]) {
        ordersMap[key] = {
          user_id: row.user_id,
          staff_id: row.staff_id,
          tax_id: row.tax_id,
          discount: row.discount,
          payment_id: row.payment_id,
          order_status: row.order_status,
          products: []
        };
      }

      ordersMap[key].products.push({
        id: row.product_id,
        name: row.product_name,
        quantity: row.quantity,
        price: row.price
      });
    }

    const trx = await knex.transaction();

    try {
      for (const key of Object.keys(ordersMap)) {
        const orderData = ordersMap[key];
        const products = orderData.products;


        for (const p of products) {
          const stock = await trx("stocks").where("product_id", p.id).first();

          if (!stock) throw new Error(`Product not found: ${p.id}`);
          if (stock.quantity < p.quantity)
            throw new Error(`Low stock for product ${p.id}`);
        }


        const taxRow = await trx("tax").where({ id: orderData.tax_id }).first();
        if (!taxRow) throw new Error(`Invalid tax_id: ${orderData.tax_id}`);


        const totalQty = products.reduce((a, p) => a + p.quantity, 0);
        const subTotal = products.reduce((a, p) => a + p.quantity * p.price, 0);
        const tax_amount = (taxRow.percent / 100) * subTotal;
        const discountAmount = (orderData.discount / 100) * subTotal;
        const grand_total = subTotal + tax_amount - discountAmount;

        const invoice_number = `INV_${Date.now()}_${Math.floor(Math.random() * 99999)}`;


        const [orderId] = await trx("orders").insert({
          invoice_number,
          user_id: orderData.user_id,
          staff_id: orderData.staff_id,
          discount: orderData.discount,
          quantity: totalQty,
          subTotal,
          tax_id: orderData.tax_id,
          tax_percent: taxRow.percent,
          tax_amount,
          payment_id: orderData.payment_id,
          is_paid: "unpaid",
          order_status: orderData.order_status,
          grand_total
        });


        for (const p of products) {
          await trx("order_items").insert({
            product_id: p.id,
            order_id: orderId,
            quantity: p.quantity,
            price: p.price,
            subTotal: p.price * p.quantity
          });

          await trx("stocks")
            .where("product_id", p.id)
            .decrement("quantity", p.quantity);
        }


        await trx("payment_transactions").insert({
          order_id: orderId,
          payment_mode_id: orderData.payment_id,
          paid_at: trx.fn.now(),
          closed_at: trx.fn.now()
        });

      }

      await trx.commit();
      return res.status(200).json({ message: "Bulk orders uploaded successfully" });

    } catch (err) {
      await trx.rollback();
      console.error(err);
      return res.status(400).json({ message: err.message });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to read Excel file", error });
  }
};




exports.exportOrders = async (req, res) => {
  if (!req.body) {
    return res.status(404).json({ message: "req cant't be empty" })
  }
  try {
    const orders = await knex("orders as o")
      .leftJoin("order_items as oi", "oi.order_id", "o.id")
      .select(
        "o.invoice_number",
        "o.user_id",
        "o.staff_id",
        "o.discount",
        "o.quantity",
        "o.subTotal",
        "o.tax_id",
        "o.tax_percent",
        "o.tax_amount",
        "o.payment_id",
        "o.is_paid",
        "o.order_status",
        "o.grand_total",
        "oi.order_id as order_id",
        "oi.product_id as product_id",
        "oi.quantity as quantity",
        "oi.price as price",
        "oi.subTotal as sub_total"
      );

    const worksheet = XLSX.utils.json_to_sheet(orders);

    const workbook = XLSX.utils.book_new();

    const beforeBuffer = XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader("Content-Disposition", "attachment; filename=orders.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    return res.send(buffer);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'error exporting orders', error });
  }
}
