import React, { useState } from "react";
import "./SidebarFilter.css";

const SidebarFilter = ({ onFilter }) => {
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const categories = ["Electronics", "Fashion", "Home", "Books", "Toys"];

    const handleApply = () => {
        onFilter({ category, minPrice, maxPrice });
    };

    const handleClear = () => {
        setCategory("");
        setMinPrice("");
        setMaxPrice("");
        onFilter({});
    };

    return (
        <div className="sidebar-filter">
            <h3>Filters</h3>

            {/* Category */}
            <div className="filter-group">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Price Range */}
            <div className="filter-group">
                <label>Price Range</label>
                <div className="price-inputs">
                    <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <span>-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>
            </div>

            {/* Buttons */}
            <div className="filter-actions">
                <button className="apply-btn" onClick={handleApply}>
                    Apply
                </button>
                <button className="clear-btn" onClick={handleClear}>
                    Clear
                </button>
            </div>
        </div>
    );
};

export default SidebarFilter;
