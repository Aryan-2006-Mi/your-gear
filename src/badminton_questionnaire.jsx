import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./badminton_questionnaire.css";


function BadmintonQuestionnaire() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [step, setStep] = useState(1);

    const [interestedItems, setInterestedItems] =
        useState([]);

    const [interestLevel, setInterestLevel] =
        useState("");

    const [playingFrequency, setPlayingFrequency] =
        useState("");

    const [currentLevel, setCurrentLevel] =
        useState("");


    // ==================================================
    // CHECK EXISTING BADMINTON PREFERENCE
    // ==================================================

    useEffect(() => {

        const token =
            localStorage.getItem("token");


        // Guest user
        if (!token) {

            setLoading(false);

            return;

        }


        fetch(
            "http://localhost:5000/api/preferences/Badminton",
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        )
        .then(response => response.json())
        .then(data => {

            console.log(
                "Badminton preference:",
                data
            );


            // User already has recent preference
            if (
                data.exists &&
                !data.needsItemsQuestionnaire
            ) {

                navigate("/badminton/recommendation");

                return;

            }


            // First-time user
            setLoading(false);

        })
        .catch(error => {

            console.error(
                "Preference check error:",
                error
            );

            setLoading(false);

        });

    }, [navigate]);


    // ==================================================
    // Q1 — SELECT ITEMS
    // ==================================================

    const toggleItem = (item) => {

        setInterestedItems(previous => {

            if (previous.includes(item)) {

                return previous.filter(
                    value => value !== item
                );

            }

            return [
                ...previous,
                item
            ];

        });

    };


    // ==================================================
    // SAVE PREFERENCES
    // ==================================================

    const savePreferences = async () => {

        const token =
            localStorage.getItem("token");


        if (!token) {

            console.error(
                "No authentication token."
            );

            return;

        }


        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/preferences/Badminton",
                    {
                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`

                        },

                        body: JSON.stringify({

                            interestedItems,

                            interestLevel,

                            playingFrequency,

                            currentLevel

                        })

                    }
                );


            const data =
                await response.json();


            console.log(
                "Saved preferences:",
                data
            );


            if (!response.ok) {

                return;

            }


            // We'll build this page next
            navigate(
                "/badminton/recommendation"
            );


        } catch (error) {

            console.error(
                "Save error:",
                error
            );

        }

    };


    // ==================================================
    // NEXT
    // ==================================================

    const handleNext = () => {

        if (step < 4) {

            setStep(
                previous => previous + 1
            );

        } else {

            savePreferences();

        }

    };


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {

        return (
            <div>
                Loading...
            </div>
        );

    }


    // ==================================================
    // PAGE
    // ==================================================

    return (

        <div className="badminton-questionnaire">

            <div className="questionnaire-container">

                {/* ---------------------------------- */}
                {/* HEADER */}
                {/* ---------------------------------- */}

                <div className="questionnaire-header">

                    <button
                        onClick={() =>
                            navigate("/homepage")
                        }
                    >
                        ← Back
                    </button>

                    <span>
                        BADMINTON
                    </span>

                </div>


                {/* ---------------------------------- */}
                {/* PROGRESS */}
                {/* ---------------------------------- */}

                <div className="questionnaire-progress">

                    <span>
                        0{step}
                    </span>

                    <span>
                        / 04
                    </span>

                </div>


                {/* ================================== */}
                {/* QUESTION 1 */}
                {/* ================================== */}

                {step === 1 && (

                    <div className="question">

                        <p>
                            QUESTION 01
                        </p>

                        <h1>
                            What are you
                            <br />
                            interested to buy?
                        </h1>

                        <div className="options">

                            {[
                                "Racket",
                                "Shoes",
                                "Shuttlecock",
                                "Clothing",
                                "Bag",
                                "Accessories"
                            ].map(item => (

                                <button
                                    key={item}
                                    className={
                                        interestedItems.includes(item)
                                            ? "selected"
                                            : ""
                                    }
                                    onClick={() =>
                                        toggleItem(item)
                                    }
                                >

                                    {item}

                                    {interestedItems.includes(item) && (
                                        <span> ✓</span>
                                    )}

                                </button>

                            ))}

                        </div>

                    </div>

                )}


                {/* ================================== */}
                {/* QUESTION 2 */}
                {/* ================================== */}

                {step === 2 && (

                    <div className="question">

                        <p>
                            QUESTION 02
                        </p>

                        <h1>
                            How interested are
                            <br />
                            you in badminton?
                        </h1>

                        <div className="options">

                            {[
                                ["career", "Career"],
                                ["casual", "Only casual fun"],
                                ["better", "Want to be better"],
                                ["compete", "Compete"]
                            ].map(
                                ([value, label]) => (

                                    <button
                                        key={value}
                                        className={
                                            interestLevel === value
                                                ? "selected"
                                                : ""
                                        }
                                        onClick={() =>
                                            setInterestLevel(value)
                                        }
                                    >

                                        {label}

                                        {interestLevel === value && (
                                            <span> ✓</span>
                                        )}

                                    </button>

                                )
                            )}

                        </div>

                    </div>

                )}


                {/* ================================== */}
                {/* QUESTION 3 */}
                {/* ================================== */}

                {step === 3 && (

                    <div className="question">

                        <p>
                            QUESTION 03
                        </p>

                        <h1>
                            How much do you
                            <br />
                            play badminton?
                        </h1>

                        <div className="options">

                            {[
                                ["rarely", "Rarely"],
                                ["weekly", "Once or twice a week"],
                                ["frequent", "Several times a week"],
                                ["almost_daily", "Almost every day"]
                            ].map(
                                ([value, label]) => (

                                    <button
                                        key={value}
                                        className={
                                            playingFrequency === value
                                                ? "selected"
                                                : ""
                                        }
                                        onClick={() =>
                                            setPlayingFrequency(value)
                                        }
                                    >

                                        {label}

                                        {playingFrequency === value && (
                                            <span> ✓</span>
                                        )}

                                    </button>

                                )
                            )}

                        </div>

                    </div>

                )}


                {/* ================================== */}
                {/* QUESTION 4 */}
                {/* ================================== */}

                {step === 4 && (

                    <div className="question">

                        <p>
                            QUESTION 04
                        </p>

                        <h1>
                            What's your
                            <br />
                            current level?
                        </h1>

                        <div className="options">

                            {[
                                ["beginner", "Beginner"],
                                ["intermediate", "Intermediate"],
                                ["advanced", "Advanced"]
                            ].map(
                                ([value, label]) => (

                                    <button
                                        key={value}
                                        className={
                                            currentLevel === value
                                                ? "selected"
                                                : ""
                                        }
                                        onClick={() =>
                                            setCurrentLevel(value)
                                        }
                                    >

                                        {label}

                                        {currentLevel === value && (
                                            <span> ✓</span>
                                        )}

                                    </button>

                                )
                            )}

                        </div>

                    </div>

                )}


                {/* ---------------------------------- */}
                {/* NEXT */}
                {/* ---------------------------------- */}

                <button
                    className="next-button"
                    onClick={handleNext}
                >

                    {step === 4
                        ? "Continue"
                        : "Next"
                    }

                    <span>
                        →
                    </span>

                </button>

            </div>

        </div>

    );

}


export default BadmintonQuestionnaire;