import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useGame } from "./contexts/GameContext";

const Drawer = () => {
  const [open, setOpen] = useState(false);
  const {
    logout,
    isLogged,
    setIsModalOpen
  } = useGame();

  return (
    <>
      {/* Open Drawer Button */}
      {!open && (
        <button
          className="w-10 h-10 min-w-[40px] min-h-[40px] shrink-0 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg hover:bg-gray-100 transition duration-150 ease-in-out fixed top-4 right-4 z-50 sm:static"
          onClick={() => setOpen(true)}
          aria-label="Open navigation drawer"
        >
          <FiMenu className="size-5" />
        </button>
      )}

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 sm:w-96 bg-white text-lg shadow-lg z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
          }`}
        aria-label="Navigation drawer"
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
          onClick={() => setOpen(false)}
          aria-label="Close navigation drawer"
        >
          <FiX size={24} />
        </button>
        {/* Navigation Content */}
        <nav className="mt-16 flex flex-col gap-4 px-6 text-slate-700">
          <Link to="/" className="hover:text-blue-500 transition">Home</Link>
          <Link to="/leaks-rumours" className="hover:text-blue-600 transition">Leaks & Rumours</Link>
          <div className="border my-6"></div>
          <button
            className="text-left hover:scale-105 rounded-md text-white py-1.5 px-2 border bg-blue-500 w-fit transition"
            onClick={() => {
              setOpen(false);
              setIsModalOpen(true);
            }}
          >
            {isLogged ? (
              <div>Logout</div>
            ) : (
              <div>I am an admin</div>
            )}
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Drawer;