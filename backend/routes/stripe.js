const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const DOMAIN = 'http://localhost:5173';

// Create Stripe Checkout session to use their prebuilt secure checkout page
router.post('/create-checkout-session', async (req, res) => {

    try {
        const { items } = req.body;
        const line_items = items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {name: item.name},
                unit_amount: item.price, // price in cents (5000 = $50.00)
            },
            quantity: item.quantity,
        }));
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ["card", "us_bank_account"],
            success_url: `${DOMAIN}?success=true`,
            cancel_url: `${DOMAIN}?cancel=true`,
            line_items,
        });
        res.status(200).json({url: session.url});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }    
});


// Create Stripe PaymentIntent Object that tracks the entire payment process for a customer
// Used to handle payments securely and encures funds are properly authorized 
// router.post('/create-payment-intent', async(req, res) => {
//     try {
//         const {amount} = req.body;

//         if (!amount) {
//             return res.status(400).json({ error: "Invalid amount." });
//         }
        
//         // Create PaymentIntent Obj here with amount in cents
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount,
//             currency: "usd",
//             payment_method_types: ["card"],
//         });

//         // Send clientSecret to the frontend
//         res.json({clientSecret: paymentIntent.client_secret});
//     } catch (error) {
//         console.error("Stripe error: ", error);
//         res.status(500).json({error: error.message});
//     }
// });


// This endpoint listens for events from Stripe and automatically 
// updates the app based on real-time payment status
// Located in Stripe Dashboard -> Developers -> Webhooks
router.post("/webhook", (req, res) => {
    let event;
    try {
        event = JSON.parse(req.body.toString());
        
        console.log("✅ Parsed Webhook Event:", event); // 🔍 Log parsed event
        console.log("🔍 Event Type Received:", event.type); // Debug event type

    } catch (error) {
        console.error("Webhook error: ", error);
        res.status(500).json({error: error.message});
    }

    // Handle different Stripe payment results
    switch (event.type) {
        case "payment_intent.succeeded":
            console.log("Payment success: ", event.data.object.id);
            break
        case "payment_intent.payment_failed":
            console.log("Payment failed: ", event.data.object.id);
            break
        case "charge.refunded":
            console.log("Refund processed: ", event.data.object.id);
            break
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }
    res.status(200).json({message: "Stripe API call successful"});
});

module.exports = router;