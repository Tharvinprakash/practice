const express = require("express");
const knex = require("../../config/db");

function validation(
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
) {
  let error = {};

  if (!name) {
    error.name = "name required";
  }

  if (phone_no.length !== 10) {
    error.phone_no = "phone number must be 10 characters";
  }

  const validateEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!validateEmailRegex.test(email)) {
    error.email = "email is invalid";
  }

  if (!address) {
    error.address = "address is required";
  }

  if (!city) {
    error.city = "city is required";
  }

  if (!state) {
    error.state = "state is required";
  }

  if (gst_number.length !== 15) {
    error.gst_number = "gst number must be length 15";
  }

  if (!referred_staff) {
    error.referred_staff = "referred staff is required";
  }

  if (!created_by) {
    error.created_by = "created by is required";
  }

  if (!updated_by) {
    error.updated_by = "updated by is required";
  }

  return error;
}

exports.addSupplier = async (req, res) => {
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

  try {
    let supplier = await knex("suppliers").where({ email: email }).first();
    if (supplier) {
      return res.status(400).json({ message: "supplier already exists" });
    }
    await knex("suppliers").insert({
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
    return res.status(200).json({ message: "supplier added" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error while adding supplier" });
  }
};

exports.getSupplier = async (req, res) => {
  let suppliers = await knex("suppliers").select("*");
  return res.status(200).send(suppliers);
};

exports.getSupplierById = async (req, res) => {
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

exports.updateSupplier = async (req, res) => {
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
      updated_by: updated_by
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







