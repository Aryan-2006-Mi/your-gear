import "./recommendation_page.css";
import { useNavigate } from "react-router-dom";

function RecommendationPage({ sport }) {
    const navigate = useNavigate();

    const handleRecommended = () => {
        // Later this will open the common Products page
        // with recommendations based on the user's preferences.

        navigate(`/sports/${sport.toLowerCase()}/products`);
    };

    const handleCustomize = () => {
        // Opens sport-specific customization page.
        // The sport name determines which customization page is shown.

        navigate(`/sports/${sport.toLowerCase()}/customize`);
    };

    return (
        <div className="recommendation-page">

            {/* Top section */}
            <div className="recommendation-header">

                <p className="recommendation-eyebrow">
                    {sport}
                </p>

                <h1>
                    How do you want<br />
                    to find your gear?
                </h1>

                <p className="recommendation-subtitle">
                    Choose how you'd like us to build your {sport} gear
                    recommendations.
                </p>

            </div>


            {/* Two choices */}
            <div className="recommendation-options">

                {/* Recommended by us */}
                <button
                    className="recommendation-card"
                    onClick={handleRecommended}
                >

                    <div className="recommendation-card-number">
                        01
                    </div>

                    <div className="recommendation-card-content">

                        <h2>
                            Recommended by us
                        </h2>

                        <p>
                            Let Your Gear choose the right products
                            and features based on your playing style,
                            experience and preferences.
                        </p>

                    </div>

                    <div className="recommendation-arrow">
                        →
                    </div>

                </button>


                {/* Customize */}
                <button
                    className="recommendation-card"
                    onClick={handleCustomize}
                >

                    <div className="recommendation-card-number">
                        02
                    </div>

                    <div className="recommendation-card-content">

                        <h2>
                            Customize for yourself
                        </h2>

                        <p>
                            Choose the exact features you want and
                            find {sport} gear that matches your requirements.
                        </p>

                    </div>

                    <div className="recommendation-arrow">
                        →
                    </div>

                </button>

            </div>

        </div>
    );
}

export default RecommendationPage;