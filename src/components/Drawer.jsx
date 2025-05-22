import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

const Drawer = () => {
  const [open, setOpen] = useState(false);

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
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
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
        <nav className="mt-16 flex flex-col gap-4 px-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition">Home</Link>
          <Link to="/leaks-rumours" className="text-gray-700 hover:text-blue-600 transition">Leaks & Rumours</Link>
        </nav>
      </aside>
    </>
  );
};

export default Drawer;