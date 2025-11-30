import { useEffect, useState } from "react";
import {Sun} from "./icons/icons"
function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  // Load saved theme once
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
    setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <button
      className=" md:flex bg-bg-small rounded-2xl p-2 h-fit w-fit "
        
      onClick={toggleTheme}
    >
      <Sun color="gray" size={20} />
    </button>
  );
}

export default ThemeToggle;
