import { useRef } from "react";

import LoginPage from "./login_page";
import CreateGearID from "./create_gearid";

function AuthFlow() {

  const authContainerRef = useRef(null);

  const scrollToCreate = () => {
    authContainerRef.current?.scrollTo({
      top: window.innerHeight,
      behavior: "smooth"
    });
  };

  const scrollToLogin = () => {
    authContainerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="auth-flow" ref={authContainerRef}>

      <section className="auth-section">
        <LoginPage onCreateGearID={scrollToCreate} />
      </section>

      <section className="auth-section">
        <CreateGearID onLogin={scrollToLogin} />
      </section>

    </div>
  );
}

export default AuthFlow;