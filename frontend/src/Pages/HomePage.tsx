import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import HeroCarousel from "../components/HeroCarousel";

interface LocationState {
  role: string;
}

const HomePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const role = state?.role || localStorage.getItem("role") || "client";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header 
        role={role} 
        onBookNowClick={() => navigate("/booking")}
      />
      <main className="flex-1">
        <HeroCarousel onBookNowClick={() => navigate("/booking")} />
      </main>
    </div>
  );
};

export default HomePage;
