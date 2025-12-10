const express = require("express");
const knex = require("../../config/db");

function validation(
  ref_no,
  supplier_id,
  product_id,
  grand_total,
  added_by,
  discount,
  payment_status
) {
  let error = {};
  if (!ref_no) {
    error.ref_no = "ref_no is required";
  }

  if (!supplier_id) {
    error.supplier_id = "supplier_id image is required";
  }

  if (!product_id) {
    error.product_id = "product_id is required";
  }

  if (!grand_total) {
    error.grand_total = "grand_total is required";
  }

  if (!added_by) {
    error.added_by = "added_by is required";
  }

  if (!discount) {
    error.discount = "discount is required";
  }

  if (!payment_status) {
    error.payment_status = "payment_status is required";
  }

  return error;
}

function generateRefNumber() {
  const invoice_number = "REF_" + Date.now();
  console.log(invoice_number);
  return invoice_number;
}


exports.create = async (req, res) => {
  const {
    supplier_id,
    product_id,
    grand_total,
    added_by,
    discount,
    payment_status,
  } = req.body;
  const error = validation(
    product_id,
    supplier_id,
    grand_total,
    added_by,
    discount,
    payment_status
  );
  const errLength = Object.keys(error).length;

  if (errLength > 0) {
    return res.status(400).send(error);
  }

  try {
    let quotation = await knex("quotations").where({ ref_no: ref_no }).first();
    if (quotation) {
      return res.status(400).json({ message: "quotation exist" });
    }

    let ref_no = generateRefNumber();

    await knex("quotations").insert({
      ref_no: ref_no,
      supplier_id: supplier_id,
      product_id: product_id,
      grand_total: grand_total,
      added_by: added_by,
      discount: discount,
      payment_status: payment_status,
    });
    return res.status(200).json({ message: "quotation created" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "error while creating a quotation" });
  }
};

exports.getQuotation = async (req, res) => {
  let quotations = await knex("quotations").select("*");
  return res.status(200).send(quotations);
};

exports.getQuotationById = async (req, res) => {
  const quotationId = req.params.id;
  try {
    let quotation = await knex("quotations").where({ id: quotationId }).first();
    return res.status(200).send(quotation);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "error while parsing get quotation" });
  }
};

exports.update = async (req, res) => {
  const quotationId = req.params.id;
  const {
    ref_no,
    supplier_id,
    product_id,
    grand_total,
    added_by,
    discount,
    payment_status,
  } = req.body;
  const errLength = Object.keys(error).length;

  if (errLength > 0) {
    return res.status(400).send(error);
  }

  let quotation;
  try {
    let existingQuotation = await knex("quotations")
      .where({ ref_no: ref_no })
      .first();
    if (existingQuotation) {
      return res.status(400).json({ message: "quotation exist" });
    }
    quotation = await knex("quotations").where({ id: quotationId }).first();
    if (!quotationId) {
      return res.status(404).json({ message: "quotation not found" });
    }
    if (quotation) {
      await knex("quotations").where({ id: quotationId }).update({
        ref_no: ref_no,
        supplier_id: supplier_id,
        product_id: product_id,
        grand_total: grand_total,
        added_by: added_by,
        discount: discount,
        payment_status: payment_status,
      });
    }
    return res.status(200).json({ message: "quotation updated" });
  } catch {
    console.log(error);
    return res.status(400).json({ message: "Error while updating quotation" });
  }
};

exports.delete = async (req, res) => {
    let quotationId = req.params.id;
    if (!quotationId) {
        return res.status(400).json({ message: "quotationId missing" });
    }
    let quotation;
    try {
        quotation = await knex("quotations").where({ id: quotationId }).first();
        if (!quotation) {
            return res.status(404).json({ message: "quotation is not found" });
        }
        if (quotation) {
            await knex("quotations").where({ id: quotationId }).del();
        }
        return res.status(200).json({ message: "quotation deleted" });
    } catch (error) {
        return res.status(400).json({ message: "error while deleting quotation" })
    }
};



