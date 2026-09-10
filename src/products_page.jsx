import "./products_page.css";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ProductsPage({ sport }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [products, setProducts] = useState([]);
    const [preference, setPreference] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Customization data coming from CustomizePage
    const customization =
        location.state?.customization || null;

    // ==================================================
    // LOAD PRODUCTS + USER PREFERENCE
    // ==================================================

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                // ------------------------------------------
                // Get user's saved preference
                // ------------------------------------------

                const preferenceResponse = await fetch(
                    `https://your-gear-backend.onrender.com/api/preferences/${sport}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!preferenceResponse.ok) {
                    throw new Error(
                        "Failed to load preferences."
                    );
                }

                const preferenceData =
                    await preferenceResponse.json();

                setPreference(
                    preferenceData.preference
                );

                // ------------------------------------------
                // Get products for this sport
                // ------------------------------------------

                const productsResponse = await fetch(
                    `https://your-gear-backend.onrender.com/api/products?sport=${encodeURIComponent(
                        sport
                    )}`
                );

                if (!productsResponse.ok) {
                    throw new Error(
                        "Failed to load products."
                    );
                }

                const productsData =
                    await productsResponse.json();

                setProducts(productsData);

            } catch (err) {
                console.error(
                    "Products page error:",
                    err
                );

                setError(
                    "Unable to load products right now."
                );

            } finally {
                setLoading(false);
            }
        };

        loadData();

    }, [sport, navigate]);


    // ==================================================
    // FILTER + RANK PRODUCTS
    // ==================================================

    const displayedProducts = useMemo(() => {

        if (!preference) {
            return products;
        }

        const interestedItems =
            preference.interestedItems || [];

        // ------------------------------------------
        // STEP 1
        // Only show categories the user selected
        // ------------------------------------------

        let filtered = products.filter((product) => {

            return interestedItems.includes(
                product.category
            );

        });


        // ------------------------------------------
        // STEP 2
        // CUSTOMIZATION FILTER
        // ------------------------------------------

        if (customization) {

            filtered = filtered.filter((product) => {

                const itemSelections =
                    customization[
                        product.category
                    ];

                // No customization for this category
                if (!itemSelections) {
                    return true;
                }

                const features =
                    product.features || {};

                return Object.entries(
                    itemSelections
                ).every(
                    ([key, selectedValue]) => {

                        return (
                            !selectedValue ||
                            features[key] === selectedValue
                        );

                    }
                );

            });

        }


        // ------------------------------------------
        // STEP 3
        // Basic recommendation ranking
        // ------------------------------------------

        const currentLevel =
            preference.currentLevel;

        const interestLevel =
            preference.interestLevel;

        filtered = [...filtered].sort(
            (a, b) => {

                let scoreA = 0;
                let scoreB = 0;


                // ======================================
                // PLAYING LEVEL
                // ======================================

                if (
                    currentLevel === "beginner"
                ) {

                    // Beginners can benefit from
                    // more flexible/easier products.

                    if (
                        a.features?.flexibility ===
                        "Flexible"
                    ) {
                        scoreA += 2;
                    }

                    if (
                        b.features?.flexibility ===
                        "Flexible"
                    ) {
                        scoreB += 2;
                    }

                }


                if (
                    currentLevel === "advanced"
                ) {

                    if (
                        a.features?.flexibility ===
                        "Stiff"
                    ) {
                        scoreA += 2;
                    }

                    if (
                        b.features?.flexibility ===
                        "Stiff"
                    ) {
                        scoreB += 2;
                    }

                }


                // ======================================
                // CAREER / COMPETITIVE PLAY
                // ======================================

                if (
                    interestLevel === "career" ||
                    interestLevel === "compete"
                ) {

                    if (
                        a.availability ===
                        "In Stock"
                    ) {
                        scoreA += 1;
                    }

                    if (
                        b.availability ===
                        "In Stock"
                    ) {
                        scoreB += 1;
                    }

                }


                return scoreB - scoreA;

            }
        );


        return filtered;

    }, [
        products,
        preference,
        customization
    ]);


    // ==================================================
    // OPEN REAL PRODUCT
    // ==================================================

    const handleViewProduct = (product) => {

        if (!product.productUrl) {
            return;
        }

        window.open(
            product.productUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };


    // ==================================================
    // UPDATE PREFERENCES
    // ==================================================

    const handleUpdatePreferences = () => {

        navigate(
            `/badminton/update-preferences`
        );

    };


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {

        return (
            <div className="products-loading">
                <span>Loading your gear...</span>
            </div>
        );

    }


    // ==================================================
    // ERROR
    // ==================================================

    if (error) {

        return (
            <div className="products-error">

                <h2>
                    Something went wrong
                </h2>

                <p>
                    {error}
                </p>

                <button
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>

            </div>
        );

    }


    // ==================================================
    // PAGE
    // ==================================================

    return (
        <div className="products-page">

            {/* =========================================
                HEADER
            ========================================== */}

            <header className="products-header">

                <div>

                    <p className="products-eyebrow">
                        {sport}
                    </p>

                    <h1>
                        Your {sport} gear
                    </h1>

                    <p className="products-subtitle">

                        {customization
                            ? "Gear matching the features you selected."
                            : "Gear selected around your playing preferences."
                        }

                    </p>

                </div>


                <button
                    className="update-preferences-button"
                    onClick={handleUpdatePreferences}
                >
                    Update Preferences
                </button>

            </header>


            {/* =========================================
                PRODUCT COUNT
            ========================================== */}

            <div className="products-info">

                <span>
                    {displayedProducts.length}{" "}
                    {displayedProducts.length === 1
                        ? "product"
                        : "products"}
                </span>

                {customization && (
                    <span className="customized-label">
                        Customized for you
                    </span>
                )}

            </div>


            {/* =========================================
                PRODUCTS
            ========================================== */}

            {displayedProducts.length === 0 ? (

                <div className="no-products">

                    <h2>
                        No exact matches found
                    </h2>

                    <p>
                        Try changing your customization
                        preferences to see more gear.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                `/sports/${sport.toLowerCase()}/customize`
                            )
                        }
                    >
                        Change Customization
                    </button>

                </div>

            ) : (

                <div className="products-grid">

                    {displayedProducts.map(
                        (product) => (

                            <article
                                className="product-card"
                                key={product._id}
                            >

                                {/* IMAGE */}

                                <div className="product-image">

                                    {product.image ? (

                                        <img
                                            src={product.image}
                                            alt={product.name}
                                        />

                                    ) : (

                                        <div className="product-image-placeholder">
                                            {product.category}
                                        </div>

                                    )}

                                </div>


                                {/* DETAILS */}

                                <div className="product-details">

                                    <p className="product-category">
                                        {product.category}
                                    </p>

                                    <h2>
                                        {product.name}
                                    </h2>

                                    {product.brand && (
                                        <p className="product-brand">
                                            {product.brand}
                                        </p>
                                    )}


                                    {/* PRICE + STOCK */}

                                    <div className="product-bottom">

                                        <span className="product-price">
                                            ₹
                                            {Number(
                                                product.price
                                            ).toLocaleString("en-IN")}
                                        </span>

                                        <span className="product-stock">
                                            {product.availability ||
                                                "Available"}
                                        </span>

                                    </div>


                                    {/* RETAILER */}

                                    {product.retailer && (
                                        <p className="product-retailer">
                                            Available on{" "}
                                            <strong>
                                                {product.retailer}
                                            </strong>
                                        </p>
                                    )}


                                    {/* VIEW PRODUCT BUTTON */}

                                    {product.productUrl && (
                                        <button
                                            className="view-product-button"
                                            onClick={() =>
                                                handleViewProduct(
                                                    product
                                                )
                                            }
                                        >
                                            View on{" "}
                                            {product.retailer ||
                                                "Retailer"}
                                        </button>
                                    )}

                                </div>

                            </article>

                        )
                    )}

                </div>

            )}

        </div>
    );
}

export default ProductsPage;