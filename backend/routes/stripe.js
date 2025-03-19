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
            payment_intent_data: {
                capture_method: 'automatic', // Enables automatic capture of funds, USED FOR TESTING, REMOVE FOR LIVE VERSION
            },
            payment_method_types: ["us_bank_account", "card"],
            success_url: `${DOMAIN}?success=true`,
            cancel_url: `${DOMAIN}?cancel=true`,
            line_items,
        });
        res.status(200).json({url: session.url});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }    
});

// This endpoint is mainly used for direct bank transfers
// This endpoint listens for events from Stripe and automatically 
// updates the app based on real-time payment status
// Located in Stripe Dashboard -> Developers -> Webhooks
router.post("/webhook", (req, res) => {
    const signature = req.headers["stripe-signaturenature"];
    const webhookKey = process.env.STRIPE_WEBHOOK_SECRET_KEY;
    let event;
    try {
        // event = JSON.parse(req.body.toString());
        event = stripe.webhooks.constructEvent(req.body, signature, webhookKey);
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
            break;
        case "payment_intent.requires_action":
            console.log("Payment requires action: ", event.data.object.id);
            break;
        case "payment_intent.processing":
            console.log("Payment is being processed", event.data.object.id);
            break
        case "payment_intent.payment_failed":
            console.log("Payment failed: ", event.data.object.id);
            break;
        case "payment_intent.canceled":
            console.log("Payment was canceled: ", event.data.object.id);
            break;
        case "checkout.session.completed":
            console.log("Checkout session completed: ", event.data.object.id);
            break;
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }
    res.status(200).json({message: "Stripe API call successful"});
});

module.exports = router;