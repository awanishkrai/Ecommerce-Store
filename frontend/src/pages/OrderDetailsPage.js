import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiService } from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import toast from "react-hot-toast";
import "./OrderDetailsPage.css";

const OrderDetailsPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await apiService.getOrder(id);
                setOrder(data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch order details");
                toast.error("Could not load order details");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) return <LoadingSpinner message="Loading order details..." />;
    if (error) return <ErrorMessage message={error} />;
    if (!order) return <ErrorMessage message="Order not found" />;

    return (
        <div className="order-details-page">
            <div className="container">
                <div className="order-header">
                    <Link to="/user/dashboard" className="back-link">← Back to Dashboard</Link>
                    <h1>Order #{order._id}</h1>
                    <p className="order-date">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="order-content">
                    {/* Left Column: Items */}
                    <div className="order-items-section">
                        <h2>Items</h2>
                        <div className="order-items-list">
                            {order.orderItems.map((item) => (
                                <div key={item.product} className="order-item">
                                    <div className="item-info">
                                        <h3>{item.name}</h3>
                                        <p>Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="item-price">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Summary & Info */}
                    <div className="order-summary-section">
                        <div className="summary-card">
                            <h2>Order Summary</h2>
                            <div className="summary-row">
                                <span>Payment Method</span>
                                <strong>{order.paymentMethod}</strong>
                            </div>
                            <div className="summary-row">
                                <span>Payment Status</span>
                                <span className={`status-badge ${order.isPaid ? 'success' : 'warning'}`}>
                                    {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : "Not Paid"}
                                </span>
                            </div>
                            <div className="summary-row">
                                <span>Order Status</span>
                                <span className={`status-badge ${order.isDelivered ? 'success' : 'info'}`}>
                                    {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : "Processing"}
                                </span>
                            </div>
                            <hr />
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>${order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="address-card">
                            <h2>Shipping Address</h2>
                            <p>{order.shippingAddress.addressLine}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.pinCode}</p>
                            <p>{order.shippingAddress.country}</p>
                            <p>Phone: {order.shippingAddress.mobileNumber}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
