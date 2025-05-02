import React from "react";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";

const App = () => {
  document.title = process.env.REACT_APP_TITLE;

  return <HashRouter>
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 bg-white z-50">
        <nav className="flex justify-between items-center px-6 py-4 shadow">
          <Link to="/">
            <h1 className="text-xl font-bold">{process.env.REACT_APP_TITLE}</h1>
          </Link>
        </nav>
      </div>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
  </HashRouter>
};

export default App;