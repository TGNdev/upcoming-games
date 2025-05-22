import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RedditFeed from "./pages/RedditFeed";
import { GameProvider } from "./components/contexts/GameContext";

const App = () => {
  document.title = process.env.REACT_APP_TITLE;

  return (
    <GameProvider>
      <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaks-rumours" element={<RedditFeed />} />
        </Routes>
      </div>
    </HashRouter>
  </GameProvider>
  );
};

export default App;