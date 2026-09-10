import { useState } from "react";
import "./login_page.css";

function LoginPage({
    onCreateGearID,
    onLoginSuccess,
    onContinueWithoutLogin
}) {
    const [showPassword, setShowPassword] = useState(false);

    const [gearID, setGearID] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    // =========================================
    // LOGIN
    // =========================================

    const handleLogin = async (e) => {
        e.preventDefault();

        setMessage("");
        setMessageType("");

        if (!gearID.trim() || !password) {
            setMessage("Please enter your GearID and password.");
            setMessageType("error");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(
                "https://your-gear-backend.onrender.com/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        gear_id: gearID.trim(),
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Invalid GearID or password."
                );

                setMessageType("error");
                return;
            }

            // =====================================
            // SAVE LOGIN DATA
            // =====================================

            if (data.token) {
                localStorage.setItem(
                    "token",
                    data.token
                );
            }

            if (data.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );
            }

            setMessage("Login successful!");
            setMessageType("success");

            // =====================================
            // SEND USER TO APP
            // =====================================

            if (onLoginSuccess) {
                onLoginSuccess(data.user);
            }

        } catch (error) {
            console.error(
                "Login request error:",
                error
            );

            setMessage(
                "Unable to connect to the server."
            );

            setMessageType("error");

        } finally {
            setIsLoading(false);
        }
    };

    // =========================================
    // CONTINUE WITHOUT LOGIN
    // =========================================

    const handleContinueWithoutLogin = () => {
        if (onContinueWithoutLogin) {
            onContinueWithoutLogin();
        }
    };

    // =========================================
    // CREATE GEARID
    // =========================================

    const handleCreateGearID = () => {
        if (onCreateGearID) {
            onCreateGearID();
        }
    };

    // =========================================
    // PAGE
    // =========================================

    return (
        <main className="login-page">

            {/* BACKGROUND */}
            <div className="login-background"></div>


            {/* BRAND */}

            <header className="login-brand">
                <div className="login-logo">
                    Y
                </div>

                <span>
                    YOUR GEAR
                </span>
            </header>


            {/* LEFT UPPER PANEL */}

            <div className="side-panel healthier-panel">

                <span>A</span>
                <span>HEALTHIER</span>
                <span>TOMORROW</span>

            </div>


            {/* LEFT LOWER PANEL */}

            <div className="side-panel motivation-panel">

                <span>MOVE BETTER</span>
                <span>LIVE HEALTHIER</span>
                <span>BE A STRONGER YOU</span>

            </div>


            {/* RIGHT PANEL */}

            <div className="side-panel gear-panel">

                <span>MORE</span>
                <span>THAN</span>
                <span>GEAR</span>

            </div>


            {/* LOGIN PORTAL */}

            <section className="login-portal">

                <div className="portal-top-line"></div>

                <p className="login-message">
                    Let's keep building
                    <br />
                    a healthier you.
                </p>


                <form onSubmit={handleLogin}>

                    {/* GEAR ID */}

                    <div className="input-group">

                        <label htmlFor="gearID">
                            GearID
                        </label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                ♙
                            </span>

                            <input
                                id="gearID"
                                type="text"
                                placeholder="Enter your GearID"
                                autoComplete="username"
                                value={gearID}
                                onChange={(e) => {
                                    setGearID(
                                        e.target.value
                                    );
                                    setMessage("");
                                }}
                            />

                        </div>

                    </div>


                    {/* PASSWORD */}

                    <div className="input-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                ♙
                            </span>

                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(
                                        e.target.value
                                    );
                                    setMessage("");
                                }}
                            />

                            <button
                                type="button"
                                className="show-password"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword
                                    ? "◉"
                                    : "◌"}
                            </button>

                        </div>

                    </div>


                    {/* FORGOT PASSWORD */}

                    <button
                        type="button"
                        className="forgot-password"
                        onClick={() => {
                            console.log(
                                "Forgot password clicked"
                            );
                        }}
                    >
                        Forgot password?
                    </button>


                    {/* STATUS */}

                    {message && (
                        <div
                            className={`login-status ${messageType}`}
                        >
                            {message}
                        </div>
                    )}


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={isLoading}
                    >
                        <span>
                            {isLoading
                                ? "Logging in..."
                                : "Login"}
                        </span>

                        <span className="button-arrow">
                            →
                        </span>
                    </button>

                </form>


                {/* CREATE ACCOUNT */}

                <div className="create-account">

                    <div className="portal-divider"></div>

                    <p>
                        New to Your Gear?
                    </p>

                    <button
                        type="button"
                        onClick={handleCreateGearID}
                    >
                        Create your GearID

                        <span>
                            →
                        </span>
                    </button>

                </div>

            </section>


            {/* CONTINUE WITHOUT LOGIN */}

            <button
                type="button"
                className="continue-without-login"
                onClick={handleContinueWithoutLogin}
            >
                <span>
                    Continue without login
                </span>

                <span className="continue-arrow">
                    →
                </span>
            </button>

        </main>
    );
}

export default LoginPage;