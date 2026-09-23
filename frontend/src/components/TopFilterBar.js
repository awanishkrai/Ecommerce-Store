// TopFilterBar.js
import React, { useState } from "react";
import "./TopFilterBar.css";

const CATEGORIES = [
  "All",
  "Clothing",
  "Accessories",
  "Footwear",
  "Beauty",
  "Home",
];

const PRICE_RANGES = [
  { label: "All prices", value: null },
  { label: "Under $50", value: [0, 50] },
  { label: "$50 – $150", value: [50, 150] },
  { label: "$150 – $500", value: [150, 500] },
  { label: "Over $500", value: [500, 99999] },
];

const TopFilterBar = ({ onFilter }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePriceIdx, setActivePriceIdx] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const apply = (category, priceIdx) => {
    const priceRange = PRICE_RANGES[priceIdx].value;
    onFilter({
      category: category === "All" ? "" : category,
      minPrice: priceRange ? priceRange[0] : undefined,
      maxPrice: priceRange ? priceRange[1] : undefined,
    });
  };

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    apply(cat, activePriceIdx);
  };

  const handlePrice = (idx) => {
    setActivePriceIdx(idx);
    apply(activeCategory, idx);
  };

  return (
    <>
      {/* Desktop filter bar */}
      <div className="filter-bar" role="toolbar" aria-label="Product filters">
        <div className="filter-group">
          <span className="filter-label">Category</span>
          <div className="filter-chips">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-chip ${activeCategory === cat ? "filter-chip--active" : ""}`}
                onClick={() => handleCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-divider" />

        <div className="filter-group">
          <span className="filter-label">Price</span>
          <div className="filter-chips">
            {PRICE_RANGES.map((range, idx) => (
              <button
                key={range.label}
                className={`filter-chip ${activePriceIdx === idx ? "filter-chip--active" : ""}`}
                onClick={() => handlePrice(idx)}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile: collapsed trigger */}
        <button
          className="filter-mobile-trigger"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open filters"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="14" y2="12" />
            <line x1="4" y1="18" x2="10" y2="18" />
          </svg>
          Filter
        </button>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="filter-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div
            className="filter-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Filter options"
          >
            <div className="filter-drawer-header">
              <span className="filter-drawer-title">Filter</span>
              <button className="filter-drawer-close" onClick={() => setDrawerOpen(false)}>×</button>
            </div>

            <div className="filter-drawer-section">
              <span className="filter-label">Category</span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`filter-drawer-option ${activeCategory === cat ? "active" : ""}`}
                  onClick={() => { handleCategory(cat); setDrawerOpen(false); }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="filter-drawer-section">
              <span className="filter-label">Price</span>
              {PRICE_RANGES.map((range, idx) => (
                <button
                  key={range.label}
                  className={`filter-drawer-option ${activePriceIdx === idx ? "active" : ""}`}
                  onClick={() => { handlePrice(idx); setDrawerOpen(false); }}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopFilterBar;
