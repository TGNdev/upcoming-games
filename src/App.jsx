import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

const App = () => {
  document.title = process.env.REACT_APP_TITLE;

  return <HashRouter>
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  </HashRouter>
};

export default App;