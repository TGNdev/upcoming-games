import React from "react";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import PrivateRoute from "./routes/PrivateRoute";

const App = () => (
  <HashRouter>
    <div className="min-h-screen flex flex-col">
      <nav className="flex justify-between items-center px-6 py-4 shadow">
        <Link to="/">
          <h1 className="text-xl font-bold">Game Track 2025</h1>
        </Link>
        <Link
          to={localStorage.getItem("admin") == "true" ? "/admin" : "/login"}
          className="hover:underline transition-opacity opacity-80">Add a game</Link>
      </nav>
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          } />
        </Routes>
      </main>
    </div>
  </HashRouter>
);

export default App;