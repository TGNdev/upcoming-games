import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "../pages/Home";
import RedditFeed from "../pages/RedditFeed";
import PageFade from "../components/PageFade";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageFade>
              <Home />
            </PageFade>
          }
        />
        <Route
          path="/leaks-rumours"
          element={
            <PageFade>
              <RedditFeed />
            </PageFade>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
