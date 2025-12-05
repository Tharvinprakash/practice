const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const knex = require("../../config/db");

const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.stripeWebHooks = async (req, res) => {
    console.log("strip", req.body)
    const sig = req.headers["stripe-signature"];

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Webhooks Error" })
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        console.log(event)
        const orderId = event.metadata.orderId;

        try {
            await knex("orders").where({ id: orderId }).update({
                is_paid: paid
            })
            console.log("order paid ", orderId);
        } catch (error) {
            console.log("DB update error:", error);
        }
    }
    return res.status(200).json({ received: true });
}

exports.CheckStripe = async (req, res) => {
    try {
        const { id } = req.body;
        const session = await stripe.checkout.sessions.retrieve(
            id
        );
        return res.json(session)
    } catch (error) {
        console.log(error);
        return res.json({ message: "checkStripe error" });
    }
}

exports.getPaymentSuccess = async (req, res) => {
    console.log(req.params.id);
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
















// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const knex = require("../../config/db");

// exports.stripeWebhook = async (req, res) => {
//   const sig = req.headers["stripe-signature"];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     console.log("Webhook signature failed:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Handle successful payment
//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object;

//     const orderId = session.metadata.orderId;

//     try {
//       await knex("orders").where({ id: orderId }).update({
//         is_paid: true
//       });

//       console.log("Order updated as paid:", orderId);
//     } catch (error) {
//       console.log("DB update error:", error);
//     }
//   }

//   res.json({ received: true });
// };