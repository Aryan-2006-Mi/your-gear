import "./home_page.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function MainPage() {
  const navigate = useNavigate();
  const sportsSectionRef = useRef(null);

  // --------------------------------------------------
  // GET USER NAME
  // --------------------------------------------------
  const [userName, setUserName] = useState("Aryan");

  useEffect(() => {
    /*
      Later this will come from your backend/database.

      For now, we try common localStorage names so that
      the page works with your existing login/create GearID.
    */

    const storedName =
      localStorage.getItem("userName") ||
      localStorage.getItem("name") ||
      localStorage.getItem("username");

    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  // --------------------------------------------------
  // USER SPORT PREFERENCES
  // --------------------------------------------------
  /*
    TEMPORARY STRUCTURE

    Later these values will come from MongoDB.

    Example:

    careerSport = "Badminton"

    preferredSports = [
      "Basketball",
      "Football",
      "Cricket"
    ]
  */

  const careerSport =
    localStorage.getItem("careerSport") || "";

  let preferredSports = [];

  try {
    const storedPreferences =
      localStorage.getItem("preferredSports");

    if (storedPreferences) {
      preferredSports = JSON.parse(storedPreferences);
    }
  } catch (error) {
    preferredSports = [];
  }

  // --------------------------------------------------
  // ALL SPORTS
  // --------------------------------------------------

  const allSports = [
    "Badminton",
    "Basketball",
    "Football",
    "Volleyball",
    "Cricket",
    "Running",
    "Scuba Diving",
    "Boxing",
    "Mountain Climbing",
    "Tennis",
    "Swimming",
    "Cycling",
    "Table Tennis",
    "Athletics",
  ];

  // --------------------------------------------------
  // ORDER SPORTS ACCORDING TO USER PREFERENCES
  // --------------------------------------------------

  const orderedSports = useMemo(() => {
    const result = [];

    // 1. Career sport gets highest priority
    if (careerSport && allSports.includes(careerSport)) {
      result.push(careerSport);
    }

    // 2. Other preferred sports
    preferredSports.forEach((sport) => {
      if (
        allSports.includes(sport) &&
        !result.includes(sport)
      ) {
        result.push(sport);
      }
    });

    // 3. Remaining sports
    allSports.forEach((sport) => {
      if (!result.includes(sport)) {
        result.push(sport);
      }
    });

    return result;
  }, [careerSport, preferredSports]);

  // --------------------------------------------------
  // SCROLL TO SPORTS
  // --------------------------------------------------

  const handleFindSport = () => {
    sportsSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // --------------------------------------------------
  // SPORT ICONS
  // --------------------------------------------------

  const sportIcons = {
    Badminton: "🏸",
    Basketball: "🏀",
    Football: "⚽",
    Volleyball: "🏐",
    Cricket: "🏏",
    Running: "🏃",
    "Scuba Diving": "🤿",
    Boxing: "🥊",
    "Mountain Climbing": "🧗",
    Tennis: "🎾",
    Swimming: "🏊",
    Cycling: "🚴",
    "Table Tennis": "🏓",
    Athletics: "🏃",
  };

  return (
    <div className="main-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="main-navbar">

  {/* LEFT - USER */}
  <div className="navbar-user">
    <div className="hello-user">
      Hello, {userName}
    </div>
  </div>


  {/* CENTER - NAVIGATION */}
  <div className="navbar-links">

    <a href="#top">
      Home
    </a>

    <a href="#sports">
      Sports
    </a>

    <a href="#sports">
      Gear
    </a>

    <a href="#sports">
      Recommendations
    </a>

  </div>


  {/* RIGHT - ICONS + YOUR GEAR */}
  <div className="navbar-right">

    <button className="nav-icon-button">
      ♡
    </button>

    <button className="nav-icon-button cart-icon">
      🛒
    </button>

    <div className="brand-area">

      <div className="brand-logo">
        Y
      </div>

      <div className="brand-name">
        YOUR GEAR
      </div>

    </div>

  </div>

</nav>


      {/* =================================================
          HERO SECTION
      ================================================= */}

      <section className="hero-section" id="top">

        {/*
          IMPORTANT:

          The background image has intentionally been left EMPTY.

          When you get your new image, you can add it here
          using CSS background-image.
        */}

        <div className="hero-overlay"></div>


        <div className="hero-content">

          <div className="hero-small-text">
            YOUR PERFORMANCE. YOUR GEAR.
          </div>

          <h1>
            Gear up.
            <br />
            Move better.
          </h1>

          <p>
            Discover sports gear that fits your game,
            your goals and your way of moving.
          </p>

          <button
            className="find-sport-button"
            onClick={handleFindSport}
          >
            Find Your Sport
            <span>→</span>
          </button>

        </div>

      </section>


      {/* =================================================
          SPORTS SECTION
      ================================================= */}

      <section
        className="sports-section"
        id="sports"
        ref={sportsSectionRef}
      >

        <div className="sports-heading">

          <div className="section-label">
            EXPLORE
          </div>

          <h2>
            Choose your game.
          </h2>

          <p>
            Explore gear and recommendations based on
            the sports you care about.
          </p>

        </div>


        {/* =================================================
            SPORTS GRID
        ================================================= */}
        
        <div className="sports-grid">
        
          {orderedSports.map((sport, index) => {
        
            const isCareerSport =
              sport === careerSport;
        
            return (
              <div
                className={`sport-card ${
                  isCareerSport ? "career-sport" : ""
                }`}
                key={sport}
                onClick={() => {
                
                    if (sport === "Badminton") {
                        navigate("/badminton");
                    }
                  
                }}
              >
            
                {/* IMAGE AREA
                    Images will be added later */}
                <div className="sport-image">
                  {/* Add sport image here later */}
                </div>
                
                
                {/* SPORT DETAILS */}
                <div className="sport-card-content">
                
                  <div className="sport-card-top">
                
                    <span className="sport-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                
                    {isCareerSport && (
                      <span className="career-label">
                        YOUR MAIN SPORT
                      </span>
                    )}
        
                  </div>
                
                
                  <h3>
                    {sport}
                  </h3>
                
                
                  <div className="sport-card-footer">
                    <span>
                      Explore {sport}
                    </span>
                
                    <span className="sport-arrow">
                      →
                    </span>
                  </div>
                
                </div>
                
              </div>
            );
          })}
        
        </div>

      </section>

    </div>
  );
}

export default MainPage;