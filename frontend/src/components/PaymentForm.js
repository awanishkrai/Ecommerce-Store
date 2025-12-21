import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { apiService } from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./PaymentForm.css";

const PaymentForm = ({ orderData, clearCart }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);
        setError(null);

        if (!stripe || !elements) {
            setProcessing(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);

        try {
            // 1. Create PaymentIntent on backend
            const { data } = await apiService.createPaymentIntent(orderData.totalPrice);
            const clientSecret = data.clientSecret;

            // 2. Confirm Card Payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: orderData.shippingAddress.name,
                        email: orderData.user.email,
                    },
                },
            });

            if (result.error) {
                setError(result.error.message);
                toast.error(result.error.message);
            } else {
                if (result.paymentIntent.status === "succeeded") {
                    // 3. Create Order in Backend
                    const finalOrder = {
                        ...orderData,
                        paymentMethod: "Card",
                        paymentResult: {
                            id: result.paymentIntent.id,
                            status: result.paymentIntent.status,
                            update_time: new Date().toISOString(),
                            email_address: orderData.user.email,
                        },
                        isPaid: true,
                        paidAt: new Date().toISOString(),
                    };

                    await apiService.createOrder(finalOrder);

                    clearCart();
                    toast.success("Payment successful! Order placed.");
                    navigate("/"); // Or to order details
                }
            }
        } catch (err) {
            setError(err.message || "Payment failed");
            toast.error("An error occurred during payment.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="payment-form">
            <h3>Pay with Card</h3>
            <div className="card-element-container">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#424770",
                                "::placeholder": {
                                    color: "#aab7c4",
                                },
                            },
                            invalid: {
                                color: "#9e2146",
                            },
                        },
                    }}
                />
            </div>

            {error && <div className="payment-error">{error}</div>}

            <button
                type="submit"
                disabled={!stripe || processing}
                className="pay-now-btn"
            >
                {processing ? "Processing..." : `Pay $${orderData.totalPrice.toFixed(2)}`}
            </button>
        </form>
    );
};

export default PaymentForm;
