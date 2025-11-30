import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setQuery } from "../redux/features/queryState/querySlice";
import {
  Menu,
  House,
  Bird,
  Binoculars,
  Search,
  Mic,
  Sun
} from "../Components/icons/icons";
import VoiceRecorder from "../Components/VoiceRecorder";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentUserApi } from "../API/userApi";
import ThemeToggle from "./ThemeToggle";

function SearchHeaderDiv({ isOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState(null);
  const [isMicActive, setIsMicActive] = useState(false);
  const location = useLocation();
  const [inputValue, setInputValue] = useState("");

  // Determine active tab
  const isActive = location.pathname.startsWith("/Tweets")
    ? "Tweet"
    : location.pathname === "/Home"
    ? "Home"
    : location.pathname.startsWith("/SubscribedVideos")
    ? "Binoculars"
    : "";

  // Voice recorder
  const { startListening } = VoiceRecorder({
    onResult: (text) => {
      setInputValue(text);
      setIsMicActive(false);
      dispatch(setQuery(text));
      navigate("/Home");
    },
  });

  // Fetch user
  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getCurrentUserApi();
        setUserDetails(data);
      } catch (err) {
        console.error("Error fetching user", err);
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="p-2 w-full bg-accent rounded-2xl flex gap-5 items-center">
      {/* Menu Toggle Button */}
      <button
        className="bg-bg-small rounded-2xl p-2 h-fit w-fit"
        onClick={isOpen}
      >
        <Menu color="gray" size={20} />
      </button>

      {/* Logo */}
      <button
        className="hidden md:flex text-[#0175FE] text-4xl font-bold text-center mb-1"
        onClick={() => navigate("/Home")}
      >
        Nexora
      </button>

      {/* Home Button */}
      <button
        onClick={() => navigate("/Home")}
        className={`hidden md:flex rounded-2xl p-2 h-fit w-fit cursor-pointer ${
          isActive === "Home" ? "bg-[#0175FE]" : "bg-bg-small"
        }`}
      >
        <House size={20} color={isActive === "Home" ? "white" : "gray"} />
      </button>

      {/* Tweet Button */}
      <button
        onClick={() => navigate("/Tweets")}
        className={`hidden md:flex rounded-2xl p-2 h-fit w-fit cursor-pointer ${
          isActive === "Tweet" ? "bg-[#0175FE]" : "bg-bg-small"
        }`}
      >
        <Bird size={20} color={isActive === "Tweet" ? "white" : "gray"} />
      </button>

      {/* Subscribed Button */}
      <button
        onClick={() => navigate("/SubscribedVideos")}
        className={`hidden md:flex rounded-2xl p-2 h-fit w-fit cursor-pointer ${
          isActive === "Binoculars" ? "bg-[#0175FE]" : "bg-bg-small"
        }`}
      >
        <Binoculars
          size={20}
          color={isActive === "Binoculars" ? "white" : "gray"}
        />
      </button>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            dispatch(setQuery(inputValue));
            navigate("/Home");
          }
        }}
        className="flex-1 ml-1 outline-none border-2 rounded-2xl border-background text-text w-full p-2 text-base sm:p-3 sm:text-lg md:px-3.5 py-1.5 md:text-xl"
      />

      {/* Search Button */}
      <button
        className="bg-bg-small rounded-2xl p-2 h-fit w-fit"
        onClick={() => {
          dispatch(setQuery(inputValue));
          navigate("/Home");
        }}
      >
        <Search color="gray" size={20} />
      </button>

      {/* Mic Button */}
      <button
        className={`hidden md:flex bg-bg-small rounded-2xl p-2 h-fit w-fit ${
          isMicActive ? "border-2 border-blue-500" : ""
        }`}
        onClick={() => {
          startListening();
          setIsMicActive(true);
        }}
      >
        <Mic color="gray" size={20} />
      </button>

      {/* <button
        className={`hidden md:flex bg-bg-small rounded-2xl p-2 h-fit w-fit ${
          isMicActive ? "border-2 border-blue-500" : ""
        }`}
        onClick={() => {
          
        }}
      >
        <Sun color="gray" size={20} />
      </button> */}
      <ThemeToggle/>
      {/* Avatar → Link Button */}
      <button
        onClick={() => navigate(`/DashBoard/${userDetails?._id}`)}
        className="rounded-full"
      >
        <img
          src={userDetails?.avatar}
          alt="avatar"
          className="w-9 h-9 rounded-full object-cover"
        />
      </button>
    </div>
  );
}

export default SearchHeaderDiv;
