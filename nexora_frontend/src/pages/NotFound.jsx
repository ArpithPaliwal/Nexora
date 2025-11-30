import React from "react";
import { useNavigate } from "react-router-dom";
import pagenotfound from "../assets/404.png"
import ThemeToggle from "../Components/ThemeToggle";
function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-text px-6">
      <div className="   fixed top-4 right-4 z-10 ">
          <ThemeToggle />
        </div>
      {/* Big 404 Text */}
      <h1 className="text-8xl font-bold text-[#0175FE] drop-shadow-lg">
        404
      </h1>

      {/* Message */}
      <h2 className="text-3xl font-semibold mt-4">
        Page Not Found
      </h2>

      <p className="text-lg text-text/70 mt-2 max-w-lg text-center">
        The page you’re looking for doesn’t exist, was moved, or you entered the wrong URL.
      </p>

      {/* Image */}
      <img
        src={pagenotfound}
        alt="Not found"
        className="w-72 mt-10 opacity-90"
      />

      {/* Buttons */}
      <div className="flex gap-4 mt-10">
        <button
          onClick={() => navigate("/Home")}
          className="bg-[#0175FE] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0163D2] transition"
        >
          Go to Home
        </button>

        <button
          onClick={() => navigate(-1)}
          className="border-2 border-[#0175FE] text-[#0175FE] px-6 py-3 rounded-xl font-semibold hover:bg-[#e6f0ff] transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default NotFound;
