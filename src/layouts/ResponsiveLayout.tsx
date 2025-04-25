import { useState, useEffect } from "react";
import { Route, Routes } from "react-router";

// Import Mobile Views
import { MobileLoginPage } from "@/pages/mobile/auth/mobileLogin";
import { MobileRegisterPage } from "@/pages/mobile/auth/mobileRegister";
import MobileHome from "@/pages/mobile/mobileHome";
import MobileOfferProcess from "@/pages/mobile/mobileOfferProcess";

// Import Desktop Views
import { RegisterPage } from "@/pages/mobile/Register";
import Login from "@/pages/auth/Login";
import Home from "@/pages/Home";
import OfferProcess from "@/pages/OfferProcess";

interface ResponsiveRoutesProps {
  onButtonRef?: (element: HTMLAnchorElement | null) => void;
}

const ResponsiveRoutes = ({ onButtonRef }: ResponsiveRoutesProps) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Routes>
      <Route
        path="/auth/login"
        element={isMobile ? <MobileLoginPage /> : <Login />}
      />
      <Route
        path="/auth/register"
        element={isMobile ? <MobileRegisterPage /> : <RegisterPage />}
      />
      <Route
        path="/"
        element={isMobile ? <MobileHome /> : <Home onButtonRef={onButtonRef} />}
      />
      <Route
        path="/offer-process"
        element={isMobile ? <MobileOfferProcess /> : <OfferProcess />}
      />
      <Route
        path="/offer-process/:step"
        element={isMobile ? <MobileOfferProcess /> : <OfferProcess />}
      />
    </Routes>
  );
};

export default ResponsiveRoutes;
