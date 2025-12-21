import React from "react";
import { Link } from "react-router-dom";
import "./NotFoundPage.css";

const NotFoundPage = () => {
    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <div className="not-found-icon">404</div>
                <h1>Page Not Found</h1>
                <p>Oops! The page you're looking for doesn't exist or has been moved.</p>
                <div className="not-found-actions">
                    <Link to="/" className="home-btn">
                        Go to Home
                    </Link>
                    <button onClick={() => window.history.back()} className="back-btn">
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
