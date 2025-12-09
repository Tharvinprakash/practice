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
  // is_paid,
  order_status
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

  // if (is_paid === undefined) {
  //   error.is_paid = "is_paid required";
  // }

  if (!order_status) {
    error.order_status = "order status is required";
  }

  return error;
}

function generateInvoiceNumber() {
  const invoice_number = "INV_" + Date.now();
  console.log(invoice_number);
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
  // console.log(req.user)
  const staff_id = req.user.id;
  // console.log(staff_id)
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
    // is_paid,
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
    console.log(session);
    console.log("\nsessionId\n", session.id);

    await trx("payment_transactions").insert({
      order_id: orderId,
      payment_mode_id: payment_mode_id,
      paid_at: trx.fn.now(),
      closed_at: trx.fn.now(),
    });

    // products.map((product) => ({
    //   let existingProduct = trx("products as p")
    //   .leftJoin("stocks as s","p.id","s.product_id")
    //   .where("s.product_id",product.id)
    //   .select("*");
    //   existingProduct - 1;
    // }))

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

    const orders = data.map((row) => ({
      invoice_number: row["invoice_number"],
      user_id: row["user_id"],
      staff_id: row["staff_id"],
      discount: row["discount"],
      quantity: row["quantity"],
      subTotal: row["subTotal"],
      tax_id: row["tax_id"],
      tax_percent: row["tax_percent"],
      tax_amount: row["tax_amount"],
      payment_id: row["payment_id"],
      is_paid: row["is_paid"],
      order_status: row["order_status"],
      grand_total: row["grand_total"],
    }));

    const orderItems = data.map((row) => ({
      order_id: row["order_id"],
      product_id: row["product.id"],
      order_id: row["orderId"],
      quantity: row["quantity"],
      price: row["price"],
      subTotal: row["subTotal"]
    }));


    await knex.transaction(async (trx) => {
      for (const order of orders) {
        await trx("orders").insert(order);
      }
    });

    await knex.transaction(async (trx) => {
      for (const orderItem of orderItems) {
        await trx("order_items").insert(orderItem);
      }
    });


    return res.status(200).json({ message: "order imported successfully" });

  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error while import order", error });

  }
}

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
    // console.log("worksheet",worksheet);

    const workbook = XLSX.utils.book_new();
    // console.log("workbook",workbook);

    const beforeBuffer = XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    // console.log("beforeBuffer",beforeBuffer);

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    // console.log("buffer",buffer);

    res.setHeader("Content-Disposition", "attachment; filename=orders.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    return res.send(buffer);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error exporting orders', error });
  }
}


/*

const orders = data.map((row) => ({
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

*/