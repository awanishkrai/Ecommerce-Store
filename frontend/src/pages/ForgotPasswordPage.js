import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../services/api";
import toast from "react-hot-toast";
import "./ForgotPasswordPage.css";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiService.forgotPassword(email);
            setSuccess(true);
            toast.success("Reset link sent to your email!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Forgot Password</h2>
                <p className="auth-subtitle">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {success ? (
                    <div className="success-message">
                        <div className="success-icon">✉️</div>
                        <h3>Email Sent!</h3>
                        <p>Check your inbox for the reset link.</p>
                        <Link to="/login" className="back-to-login">
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>

                        <div className="auth-links">
                            <Link to="/login">Back to Login</Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
