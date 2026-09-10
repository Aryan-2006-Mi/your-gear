import "./customized_page.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CustomizePage({ sport }) {
    const navigate = useNavigate();

    const [interestedItems, setInterestedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selections, setSelections] = useState({});

    // --------------------------------------------------
    // Get the user's saved sport preferences
    // --------------------------------------------------

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        fetch(
            `https://your-gear-backend.onrender.com/api/preferences/${sport}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then((response) => response.json())
            .then((data) => {
                if (!data.exists || !data.preference) {
                    navigate(`/badminton`);
                    return;
                }

                setInterestedItems(
                    data.preference.interestedItems || []
                );

                setLoading(false);
            })
            .catch((error) => {
                console.error(
                    "Error loading preferences:",
                    error
                );

                setLoading(false);
            });
    }, [sport, navigate]);


    // --------------------------------------------------
    // Badminton customization options
    // --------------------------------------------------

    const badmintonOptions = {

        Racket: {
            title: "Racket",
            sections: [
                {
                    name: "Weight",
                    key: "weight",
                    options: [
                        "75-79g",
                        "80-84g",
                        "85-89g",
                        "90g+",
                    ],
                },
                {
                    name: "Balance",
                    key: "balance",
                    options: [
                        "Head Heavy",
                        "Even Balance",
                        "Head Light",
                    ],
                },
                {
                    name: "Flexibility",
                    key: "flexibility",
                    options: [
                        "Flexible",
                        "Medium",
                        "Stiff",
                    ],
                },
                {
                    name: "Playing Style",
                    key: "playingStyle",
                    options: [
                        "Attacking",
                        "All Round",
                        "Defensive",
                    ],
                },
            ],
        },

        Shoes: {
            title: "Shoes",
            sections: [
                {
                    name: "Shoe Type",
                    key: "shoeType",
                    options: [
                        "Lightweight",
                        "Cushioned",
                        "Maximum Support",
                    ],
                },
                {
                    name: "Sole Type",
                    key: "soleType",
                    options: [
                        "Non-Marking",
                        "Rubber",
                    ],
                },
                {
                    name: "Playing Surface",
                    key: "surface",
                    options: [
                        "Indoor Court",
                        "Wooden Court",
                        "Synthetic Court",
                    ],
                },
            ],
        },

        Shuttlecock: {
            title: "Shuttlecock",
            sections: [
                {
                    name: "Type",
                    key: "type",
                    options: [
                        "Feather",
                        "Nylon",
                    ],
                },
                {
                    name: "Speed",
                    key: "speed",
                    options: [
                        "Slow",
                        "Medium",
                        "Fast",
                    ],
                },
            ],
        },

        Clothing: {
            title: "Clothing",
            sections: [
                {
                    name: "Type",
                    key: "clothingType",
                    options: [
                        "T-Shirt",
                        "Shorts",
                        "Track Pants",
                        "Full Set",
                    ],
                },
                {
                    name: "Fit",
                    key: "fit",
                    options: [
                        "Slim",
                        "Regular",
                        "Relaxed",
                    ],
                },
            ],
        },

        Bag: {
            title: "Bag",
            sections: [
                {
                    name: "Capacity",
                    key: "capacity",
                    options: [
                        "2-3 Rackets",
                        "4-6 Rackets",
                        "6+ Rackets",
                    ],
                },
                {
                    name: "Type",
                    key: "bagType",
                    options: [
                        "Backpack",
                        "Kit Bag",
                        "Racket Bag",
                    ],
                },
            ],
        },

        Accessories: {
            title: "Accessories",
            sections: [
                {
                    name: "Accessory Type",
                    key: "accessoryType",
                    options: [
                        "Grip",
                        "Wristband",
                        "Headband",
                        "Socks",
                    ],
                },
            ],
        },
    };


    // --------------------------------------------------
    // Handle option selection
    // --------------------------------------------------

    const handleSelection = (
        item,
        sectionKey,
        option
    ) => {
        setSelections((previous) => ({
            ...previous,

            [item]: {
                ...(previous[item] || {}),
                [sectionKey]: option,
            },
        }));
    };


    // --------------------------------------------------
    // Continue to products
    // --------------------------------------------------

    const handleViewProducts = () => {
        console.log("Customization:", selections);

        /*
         * Later we will send these selections to the
         * Products page and use them to filter MongoDB
         * products.
         */

        navigate(`/sports/${sport.toLowerCase()}/products`, {
            state: {
                customization: selections,
            },
        });
    };


    // --------------------------------------------------
    // Loading
    // --------------------------------------------------

    if (loading) {
        return (
            <div className="customize-loading">
                Loading...
            </div>
        );
    }


    // --------------------------------------------------
    // Page
    // --------------------------------------------------

    return (
        <div className="customize-page">

            {/* Header */}

            <div className="customize-header">

                <p className="customize-eyebrow">
                    {sport}
                </p>

                <h1>
                    Customize your gear
                </h1>

                <p className="customize-subtitle">
                    Choose the features you want in your
                    {` ${sport}`} gear.
                </p>

            </div>


            {/* Selected Items */}

            <div className="customize-content">

                {interestedItems.map((item) => {

                    const itemConfig =
                        badmintonOptions[item];

                    if (!itemConfig) {
                        return null;
                    }

                    return (
                        <section
                            className="customize-item"
                            key={item}
                        >

                            <div className="customize-item-heading">
                                <span>
                                    {itemConfig.title}
                                </span>
                            </div>


                            {itemConfig.sections.map(
                                (section) => (

                                    <div
                                        className="customize-section"
                                        key={section.key}
                                    >

                                        <h3>
                                            {section.name}
                                        </h3>


                                        <div className="customize-options">

                                            {section.options.map(
                                                (option) => {

                                                    const isSelected =
                                                        selections[
                                                            item
                                                        ]?.[
                                                            section.key
                                                        ] === option;

                                                    return (
                                                        <button
                                                            type="button"
                                                            key={option}
                                                            className={
                                                                isSelected
                                                                    ? "customize-option selected"
                                                                    : "customize-option"
                                                            }
                                                            onClick={() =>
                                                                handleSelection(
                                                                    item,
                                                                    section.key,
                                                                    option
                                                                )
                                                            }
                                                        >
                                                            {option}
                                                        </button>
                                                    );
                                                }
                                            )}

                                        </div>

                                    </div>

                                )
                            )}

                        </section>
                    );
                })}

            </div>


            {/* Bottom button */}

            <div className="customize-footer">

                <button
                    className="view-products-button"
                    onClick={handleViewProducts}
                >
                    View Products
                    <span>→</span>
                </button>

            </div>

        </div>
    );
}

export default CustomizePage;