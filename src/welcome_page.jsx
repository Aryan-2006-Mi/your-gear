import { useState } from "react";
import "./welcome_page.css";

function WelcomePage({ onLogin }) {

    const [isExiting, setIsExiting] = useState(false);

    const handleContinue = () => {

        setIsExiting(true);

        setTimeout(() => {
            onLogin();
        }, 500);

    };

    return (
        <main
            className={`welcome-page ${
                isExiting ? "fade-exit" : ""
            }`}
        >

            {/* =========================
                BRAND
            ========================= */}

            <header className="brand">

                <div className="logo-mark">
                    Y
                </div>

                <span className="brand-small">
                    YOUR GEAR
                </span>

            </header>


            {/* =========================
                MAIN CONTENT
            ========================= */}

            <section className="welcome-content">

                {/* LEFT SIDE */}

                <div className="welcome-left">

                    <h1 className="brand-title">
                        Your
                        <br />

                        <span className="gear-word">
                            Gear
                        </span>
                    </h1>


                    <p className="tagline">
                        Design Your Healthy Lifestyle
                    </p>


                    {/* =========================
                        BOTTOM LEFT
                    ========================= */}

                    <div className="welcome-bottom">

                        <div className="motto">

                            <div className="motto-line"></div>

                            <p>
                                MOVE BETTER
                            </p>

                            <p>
                                LIVE HEALTHIER
                            </p>

                            <p>
                                BE A STRONGER YOU
                            </p>

                        </div>


                        {/* CONTINUE */}

                        <button
                            type="button"
                            className="continue-button"
                            onClick={handleContinue}
                        >
                            Continue

                            <span>
                                →
                            </span>
                        </button>

                    </div>

                </div>


                {/* =========================
                    RIGHT SIDE IMAGE
                ========================= */}

                <div className="welcome-right">

                    <div className="image-heading">
                        A HEALTHIER
                        <br />
                        TOMORROW
                    </div>


                    <div className="hero-image-wrapper">

                        <img
                            src="/welcome-page.jpg"
                            alt="Person enjoying an active outdoor lifestyle"
                            className="hero-image"
                        />


                        <div className="image-message">

                            <span>
                                BETTER
                            </span>

                            <span>
                                CHOICES
                            </span>

                            <span>
                                BRIGHTER
                            </span>

                            <span>
                                DAYS
                            </span>

                        </div>


                        <div className="image-bottom-text">
                            MORE
                            <br />
                            THAN
                            <br />
                            GEAR
                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}

export default WelcomePage;