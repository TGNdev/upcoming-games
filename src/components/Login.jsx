import React, { useState } from "react";

const Login = ({ onSuccess, onClose }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (password === process.env.REACT_APP_ADMIN_PASSWORD) {
      localStorage.setItem("admin", "true");
      onSuccess();
    } else {
      setError("Nah, you're not an admin bro.")
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-6">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter admin password"
        className="border px-3 py-2 rounded"
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex justify-between items-center">
        <button
          type="submit"
          className="bg-blue-500 text-white py-1.5 px-3 rounded hover:scale-105 transition"
        >
          I am an admin
        </button>
        <button onClick={onClose} type="button" className="text-sm text-gray-500 hover:underline">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default Login;
