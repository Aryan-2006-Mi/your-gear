import { useEffect, useState } from "react";

import {
    BrowserRouter,
    Routes,
    Route,
    useNavigate,
    useLocation
} from "react-router-dom";

import WelcomePage from "./welcome_page";
import LoginPage from "./login_page";
import CreateGearID from "./create_gearid";
import HomePage from "./home_page";
import BadmintonQuestionnaire from "./badminton_questionnaire";
import RecommendationPage from "./recommendation_page";
import CustomizePage from "./customized_page";
import ProductsPage from "./products_page";

import "./App.css";


// ======================================================
// LOGIN + CREATE GEAR ID SCROLL STAGE
// ======================================================

function AuthScrollStage({
    onLoginSuccess,
    onContinueWithoutLogin,
    onCreateSuccess,
    user,
    isGuest
}) {

    const navigate = useNavigate();
    const location = useLocation();

    const isCreatePage =
        location.pathname === "/create-gearid";


    // 0 = Login
    // 1 = Create GearID
    const [pageIndex, setPageIndex] =
        useState(isCreatePage ? 1 : 0);

    const [isTransitioning, setIsTransitioning] =
        useState(false);


    // ======================================================
    // KEEP VISUAL PAGE IN SYNC WITH URL
    // ======================================================

    useEffect(() => {

        if (isTransitioning) return;

        if (location.pathname === "/create-gearid") {

            setPageIndex(1);

        } else {

            setPageIndex(0);

        }

    }, [location.pathname, isTransitioning]);


    // ======================================================
    // LOGIN → CREATE GEARID
    // ======================================================

    const goToCreateGearID = () => {

        if (isTransitioning) return;

        setIsTransitioning(true);

        // Start physical scroll
        setPageIndex(1);

        // Change URL after animation
        setTimeout(() => {

            navigate("/create-gearid");

            setIsTransitioning(false);

        }, 750);

    };


    // ======================================================
    // CREATE GEARID → LOGIN
    // ======================================================

    const goToLogin = () => {

        if (isTransitioning) return;

        setIsTransitioning(true);

        // Start physical scroll back
        setPageIndex(0);

        // Change URL after animation
        setTimeout(() => {

            navigate("/login");

            setIsTransitioning(false);

        }, 750);

    };


    return (

        <div className="auth-scroll-viewport">

            <div
                className="auth-scroll-track"
                style={{
                    transform:
                        `translateY(-${pageIndex * 100}vh)`
                }}
            >

                {/* ================================================== */}
                {/* LOGIN PAGE */}
                {/* ================================================== */}

                <section className="auth-scroll-page">

                    <LoginPage

                        onCreateGearID={
                            goToCreateGearID
                        }

                        onLoginSuccess={
                            onLoginSuccess
                        }

                        onContinueWithoutLogin={
                            onContinueWithoutLogin
                        }

                    />

                </section>


                {/* ================================================== */}
                {/* CREATE GEARID PAGE */}
                {/* ================================================== */}

                <section className="auth-scroll-page">

                    <CreateGearID

                        onLogin={
                            goToLogin
                        }

                        onCreateSuccess={
                            onCreateSuccess
                        }

                    />

                </section>

            </div>

        </div>

    );

}


// ======================================================
// MAIN APP CONTENT
// ======================================================

function AppContent() {

    const navigate = useNavigate();
    const location = useLocation();


    // ======================================================
    // LOAD SAVED USER
    // ======================================================

    const [user, setUser] = useState(() => {

        const savedUser =
            localStorage.getItem("user");

        if (savedUser) {

            try {

                return JSON.parse(savedUser);

            } catch {

                return null;

            }

        }

        return null;

    });


    const [isGuest, setIsGuest] =
        useState(false);


    // ======================================================
    // LOGIN SUCCESS
    // ======================================================

    const handleLoginSuccess = (loggedInUser) => {

        setUser(loggedInUser);

        setIsGuest(false);

        navigate("/homepage");

    };


    // ======================================================
    // CONTINUE WITHOUT LOGIN
    // ======================================================

    const handleContinueAsGuest = () => {

        setUser(null);

        setIsGuest(true);

        navigate("/homepage");

    };


    // ======================================================
    // CREATE ACCOUNT SUCCESS
    // ======================================================

    const handleCreateSuccess = (createdUser) => {

        if (createdUser) {

            setUser(createdUser);

            setIsGuest(false);


            // Store JWT
            if (createdUser.token) {

                localStorage.setItem(
                    "token",
                    createdUser.token
                );

            }


            // Store user
            localStorage.setItem(
                "user",
                JSON.stringify(createdUser)
            );

        }

        navigate("/homepage");

    };


    // ======================================================
    // LOGOUT
    // ======================================================

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setUser(null);

        setIsGuest(false);

        navigate("/login");

    };


    // ======================================================
    // WELCOME → LOGIN
    // ======================================================

    const handleWelcomeContinue = () => {

        navigate("/login");

    };


    // ======================================================
    // HOME PAGE
    // ======================================================

    if (location.pathname === "/homepage") {
        return (
            <HomePage user={user} isGuest={isGuest} onLogout={handleLogout} />
        );
    }

    // ======================================================
    // BADMINTON QUESTIONNAIRE
    // ======================================================

    if (location.pathname === "/badminton") {
        return (
            <BadmintonQuestionnaire user={user} />
        );

    }

    // ======================================================
    // RECOMMENDATION PAGE
    // ======================================================

    if (location.pathname === "/badminton/recommendation") {
        return (
            <RecommendationPage sport="Badminton" />
        );
    }

    if (location.pathname === "/sports/badminton/customize") {
        return (
            <CustomizePage sport="Badminton" />
        );
    }
    
    if (location.pathname === "/sports/badminton/products") {
        return (
            <ProductsPage
                sport="Badminton"
            />
        );
    }

    // ======================================================
    // WELCOME PAGE
    // ======================================================

    if (location.pathname === "/") {

        return (

            <WelcomePage
                onLogin={
                    handleWelcomeContinue
                }
            />

        );

    }


    // ======================================================
    // LOGIN + CREATE GEARID
    // ======================================================

    if (
        location.pathname === "/login" ||
        location.pathname === "/create-gearid"
    ) {

        return (

            <AuthScrollStage

                onLoginSuccess={
                    handleLoginSuccess
                }

                onContinueWithoutLogin={
                    handleContinueAsGuest
                }

                onCreateSuccess={
                    handleCreateSuccess
                }

                user={user}

                isGuest={isGuest}

            />

        );

    }


    // ======================================================
    // UNKNOWN URL → WELCOME
    // ======================================================

    return (

        <WelcomePage
            onLogin={
                handleWelcomeContinue
            }
        />

    );

}


// ======================================================
// APP
// ======================================================

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="*"
                    element={
                        <AppContent />
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}


export default App;