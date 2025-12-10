const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const knex = require("../../config/db");

const jwt = require('jsonwebtoken');
require("dotenv").config();


exports.getPaymentSuccess = async (req, res) => {
    let userId,orderId;
    try {
        const{token} = req.query;
        if(!token){
            return res.status(400).json({message: "token is missing"});
        }
        try {
            const {user_id,order_id} =  jwt.verify(token, process.env.JWT_SECRET);
            userId = user_id;
            orderId = order_id;
        } catch (error) {
            return res.status(400).json({message: "Jwt error while payment"})
        }
        
        await knex("orders").where({id: orderId}).update({
            is_paid: true
        });
    } catch (error) {
        console.log(error);
        return res.status(200).json({message: "unsuccessful"})
    }
    return res.json({ message: "payment success" });
}

exports.getPaymentFail = async (req, res) => {
    const {user_id,order_id} = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ message: "payment failed" });
}










