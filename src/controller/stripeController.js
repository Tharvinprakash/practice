const express = require('express');
const { string } = require('joi');

const route = express.Router();

require("dotenv").config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
    try {
        
        const { amount, user_id, order_id } = req.body;

        console.log( { amount, user_id, order_id })
    
        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: "amount is invalid" });
        }
    
        const amountInCents = Math.round(amount * 100);
    
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
    
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {name: `Order #${order_id}`},
                        unit_amount: amountInCents ,
                    },
                    quantity : 1
                },
            ],
            metadata: {
                user_id,
                order_id
            },
            success_url: `http://localhost:3000/stripe-payment/payment-success?user_id=${user_id}&order_id=${order_id}`,
            cancel_url: "http://localhost:3000/stripe-payment/payment-failed"
        });
        console.log(session)
        return res.status(200).json({session});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: error.message});
    }
}

// http://localhost:3000/stripe-payment/webhook





// const{amount,user_id,order_id} = req.body;

// if(!amount || isNaN(amount) || amount <= 0){
    //     return res.status(400).json({message: "amount is invalid"});
    // }
    
    // const amountInCents = Math.round(amount * 100);
    
    // try {
//     const paymentIntent = await stripe.paymentIntents.create({
    //         amount: amountInCents,
    //         currency: 'usd',
    //         description: `${order_id}`,
    //         metadata: {
        //             order_id : String(order_id),
        //             user_id: String(user_id)
        //         }
        //     });
        //     return res.status(200).json({clientSecret:paymentIntent.client_secret});
        // } catch (error) {
            //     return res.status(400).json({message: "Error while create stripe payment"})
            // }

            // success_url: "https://yourdomain.com/payment-success?session_id={CHECKOUT_SESSION_ID}",
                //   cancel_url: "https://yourdomain.com/payment-failed",