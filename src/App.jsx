import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import PrivateRoute from "./routes/PrivateRoute";

const App = () => (
  <BrowserRouter basename="/game-track-2025">
    <div className="min-h-screen flex flex-col">
      <nav className="flex justify-between items-center bg-muted px-6 py-4 shadow">
        <Link to="/">
          <h1 className="text-xl font-bold text-highlight">Game Track 2025</h1>
        </Link>
        <Link to="/login" className="hover:underline hover:text-highlight transition-opacity opacity-80">Login</Link>
      </nav>
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  </BrowserRouter>
);

export default App;