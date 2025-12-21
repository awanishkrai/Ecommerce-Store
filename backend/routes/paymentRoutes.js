const express = require("express");
const Stripe = require("stripe");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Initialize Stripe with secret key from env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create Payment Intent
// @route   POST /api/payment/create-payment-intent
// @access  Private
router.post("/create-payment-intent", protect, async (req, res) => {
    try {
        const { amount, currency = "usd" } = req.body;

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amount in cents
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ message: "Payment initialization failed", error: error.message });
    }
});

module.exports = router;
