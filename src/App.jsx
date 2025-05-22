import React from "react";
import { HashRouter } from "react-router-dom";
import { GameProvider } from "./components/contexts/GameContext";
import AnimatedRoutes from "./routes/AnimatedRoutes";

const App = () => {
  document.title = process.env.REACT_APP_TITLE;

  return (
    <GameProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col">
          <AnimatedRoutes />
        </div>
      </HashRouter>
    </GameProvider>
  );
};

export default App;
