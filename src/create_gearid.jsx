import "./create_gearid.css";
import { useState, useEffect } from "react";

function CreateGearID({
    onLogin,
    onCreateSuccess
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [name, setName] = useState("");
    const [gearID, setGearID] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [gearIDStatus, setGearIDStatus] = useState("");
    const [checkingGearID, setCheckingGearID] = useState(false);
    const [gearIDAvailable, setGearIDAvailable] = useState(false);

    const [isCreating, setIsCreating] = useState(false);

    // =========================================
    // CHECK GEARID AUTOMATICALLY
    // =========================================

    useEffect(() => {
        if (gearID.trim() === "") {
            setGearIDStatus("");
            setGearIDAvailable(false);
            setCheckingGearID(false);
            return;
        }

        setCheckingGearID(true);
        setGearIDStatus("");

        const timer = setTimeout(async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/users/check-gearid?gear_id=${encodeURIComponent(
                        gearID.trim()
                    )}`
                );

                const data = await response.json();

                setGearIDAvailable(
                    Boolean(data.available)
                );

                setGearIDStatus(
                    data.message || ""
                );

            } catch (error) {
                console.error(
                    "GearID check failed:",
                    error
                );

                setGearIDAvailable(false);

                setGearIDStatus(
                    "Unable to check GearID."
                );

            } finally {
                setCheckingGearID(false);
            }
        }, 400);

        return () => clearTimeout(timer);

    }, [gearID]);


    // =========================================
    // CREATE GEARID
    // =========================================

    const handleContinue = async () => {
        if (!gearIDAvailable) {
            return;
        }

        if (
            !name.trim() ||
            !password ||
            !confirmPassword
        ) {
            setGearIDStatus(
                "Please fill all required fields."
            );

            return;
        }

        if (password !== confirmPassword) {
            setGearIDStatus(
                "Passwords do not match."
            );

            return;
        }

        setIsCreating(true);
        setGearIDStatus("");

        try {
            const response = await fetch(
                "http://localhost:5000/api/users",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        gear_id: gearID.trim(),
                        name: name.trim(),
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setGearIDStatus(
                    data.message ||
                    "Failed to create GearID."
                );

                return;
            }

            // =====================================
            // SAVE TOKEN IF BACKEND RETURNS ONE
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

            // =====================================
            // SEND CREATED USER TO APP
            // =====================================

            if (onCreateSuccess) {
                onCreateSuccess(
                    data.user || data
                );
            }

        } catch (error) {
            console.error(
                "Registration error:",
                error
            );

            setGearIDStatus(
                "Failed to connect to server."
            );

        } finally {
            setIsCreating(false);
        }
    };


    // =========================================
    // BUTTON CONDITION
    // =========================================

    const canContinue =
        gearIDAvailable &&
        !checkingGearID &&
        !isCreating &&
        name.trim() !== "" &&
        password !== "" &&
        confirmPassword !== "" &&
        password === confirmPassword;


    // =========================================
    // PAGE
    // =========================================

    return (
        <main className="create-gear-page">

            {/* BRAND */}

            <header className="create-gear-header">

                <div className="brand-circle">
                    Y
                </div>

                <span>
                    YOUR GEAR
                </span>

            </header>


            {/* PORTAL */}

            <section className="create-gear-portal">

                <div className="create-gear-line"></div>

                <h1>
                    Create your
                    <br />
                    GearID
                </h1>

                <p className="create-gear-subtitle">
                    Start building a healthier you.
                </p>


                {/* NAME */}

                <div className="create-input-group">

                    <label htmlFor="name">
                        Name
                    </label>

                    <div className="create-input-wrapper">

                        <span className="create-input-icon">
                            ♙
                        </span>

                        <input
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            autoComplete="name"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </div>


                {/* GEAR ID */}

                <div className="create-input-group">

                    <label htmlFor="gearID">
                        GearID
                    </label>

                    <div className="create-input-wrapper">

                        <span className="create-input-icon">
                            ♙
                        </span>

                        <input
                            id="gearID"
                            name="gearID"
                            type="text"
                            placeholder="Choose your GearID"
                            autoComplete="off"
                            value={gearID}
                            onChange={(e) =>
                                setGearID(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    {checkingGearID &&
                        gearID.trim() !== "" && (
                            <p className="gearid-status checking">
                                Checking GearID...
                            </p>
                        )}


                    {!checkingGearID &&
                        gearIDStatus !== "" && (
                            <p
                                className={`gearid-status ${
                                    gearIDAvailable
                                        ? "available"
                                        : "taken"
                                }`}
                            >
                                {gearIDStatus}
                            </p>
                        )}

                </div>


                {/* PASSWORD */}

                <div className="create-input-group">

                    <label htmlFor="create-password">
                        Password
                    </label>

                    <div className="create-input-wrapper">

                        <input
                            id="create-password"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Create a password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                        />

                        <button
                            type="button"
                            className="create-show-password"
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


                {/* CONFIRM PASSWORD */}

                <div className="create-input-group">

                    <label htmlFor="confirm-password">
                        Confirm Password
                    </label>

                    <div className="create-input-wrapper">

                        <input
                            id="confirm-password"
                            type={
                                showConfirmPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                        />

                        <button
                            type="button"
                            className="create-show-password"
                            onClick={() =>
                                setShowConfirmPassword(
                                    !showConfirmPassword
                                )
                            }
                            aria-label={
                                showConfirmPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {showConfirmPassword
                                ? "◉"
                                : "◌"}
                        </button>

                    </div>

                </div>


                {/* CONTINUE */}

                <button
                    type="button"
                    className="create-gear-button"
                    onClick={handleContinue}
                    disabled={!canContinue}
                >
                    <span>
                        {isCreating
                            ? "Creating..."
                            : "Continue"}
                    </span>

                    <span>
                        →
                    </span>
                </button>


                {/* LOGIN */}

                <p className="already-have">
                    Already have a GearID?
                </p>

                <button
                    type="button"
                    className="back-login-button"
                    onClick={onLogin}
                >
                    Login

                    <span>
                        →
                    </span>
                </button>

            </section>

        </main>
    );
}

export default CreateGearID;