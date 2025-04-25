// import { useState, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";

// Import Desktop Views
import { RegisterPage } from "@/pages/mobile/Register";
import Login from "@/pages/auth/Login";
import Home from "@/pages/Home";
import VerifyPropertyInformation from "@/components/pages/verifyPropertyInformation";
import ComprableProperty from "@/components/pages/comprableProperty";
import CurrentMarketConditions from "@/components/pages/currentMarketCondition";
import PropertyConditionInput from "@/components/pages/propertyConditionInput";
import PersonalizingOffer from "@/components/pages/personalizingOffer";
import RecommendedOffer from "@/components/pages/recommendedOffer";

import AuthGuard from "@/utils/AuthGuard";
import { AuthProvider } from "@/utils/AuthProvider";
import FAQ from "@/components/pages/faq";
import { useEffect, useState } from "react";
import { MobileLoginPage } from "@/pages/mobile/auth/mobileLogin";
import { MobileRegisterPage } from "@/pages/mobile/auth/mobileRegister";
import MobileHome from "@/pages/mobile/mobileHome";

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
    <AuthProvider>
      <Routes>
        <Route
          path="/login"
          element={isMobile ? <MobileLoginPage /> : <Login />}
        />
        <Route
          path="/register"
          element={isMobile ? <MobileRegisterPage /> : <RegisterPage />}
        />

        <Route
          path="/"
          element={
            isMobile ? (
              <MobileHome />
            ) : (
              <AuthGuard>
                <Home onButtonRef={onButtonRef} />
              </AuthGuard>
            )
          }
        />

        <Route
          path="/faq"
          element={
            <AuthGuard>
              <FAQ />
            </AuthGuard>
          }
        />

        <Route
          path="/agent"
          element={
            <AuthGuard>
              <VerifyPropertyInformation />
            </AuthGuard>
          }
        />
        <Route
          path="/comparable/:propertyid"
          element={
            <AuthGuard>
              <ComprableProperty />
            </AuthGuard>
          }
        />
        <Route
          path="/market/:propertyid"
          element={
            <AuthGuard>
              <CurrentMarketConditions />
            </AuthGuard>
          }
        />
        <Route
          path="/conditions/:propertyid"
          element={
            <AuthGuard>
              <PropertyConditionInput />
            </AuthGuard>
          }
        />
        <Route
          path="/preference/:propertyid"
          element={
            <AuthGuard>
              <PersonalizingOffer />
            </AuthGuard>
          }
        />
        <Route
          path="/offer/:propertyid"
          element={
            <AuthGuard>
              <RecommendedOffer />
            </AuthGuard>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
};

export default ResponsiveRoutes;
