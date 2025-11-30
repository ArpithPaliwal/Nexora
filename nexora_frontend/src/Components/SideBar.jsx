import { Link, useNavigate } from "react-router-dom";
import { getCurrentUserApi } from "../API/userApi";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Menu,
  House,
  Bird,
  Binoculars,
  Settings,
} from "../Components/icons/icons";
import instagramIcon from "../assets/instagram.png";
import linkedinIcon from "../assets/linkedin.png";
import resumeIcon from "../assets/online-resume.png";
import communicationIcon from "../assets/communication.png";
import Arpith from "../assets/Arpith.jpg";
import { Logout } from "../API/userApi";
import { logOut } from "../redux/features/authSlice/authSlice";
export function SideBar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const handleLogout = async () => {
    try {
      await Logout();
      dispatch(logOut()); // CLEAR USER FROM REDUX
      navigate("/LoginForm"); // REDIRECT USER
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userid = await getCurrentUserApi();
        setUser(userid);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []); // run only once



  return (
    <>
      {/* BACKDROP */}
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-200 
        ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } 
        z-90`}
        onClick={onClose}
      ></div>

      {/* DRAWER */}
      <div
        className={`absolute top-0 left-0 h-full w-64 bg-accent shadow-xl 
        transition-transform duration-200 rounded-r-xl border-3 border-accent
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        z-100 overflow-y-auto h-screen scrollbar-hide`}
      >
        <h1 className="text-[#0175FE] text-4xl font-bold text-center mb-4 mt-3">
          Nexora
        </h1>

        {/* MENU */}
        <nav className="flex flex-col gap-3 p-4 text-lg font-semibold">
          <Link
            to="/Home"
            className="py-2 px-3 rounded-lg text-text hover:bg-blue-50 hover:text-text1 transition flex gap-2 items-center"
            onClick={onClose}
          >
            <button
              className="bg-bg-small rounded-2xl p-2 h-fit w-fit "
              onClick={onClose}
            >
              <House size={20} color={"gray"} />
            </button>
            Home
          </Link>

          <Link
            to="/SubscribedVideos"
            className="py-2 px-3 rounded-lg text-text  hover:bg-blue-50 hover:text-text1 transition flex gap-2 items-center"
            onClick={onClose}
          >
            <button className=" bg-bg-small rounded-2xl p-2 h-fit w-fit ">
              <Binoculars size={20} color={"gray"} />
            </button>
            Subscribed Videos
          </Link>

          <Link
            to="/Tweets"
            className="py-2 px-3 rounded-lg text-text  hover:bg-blue-50 hover:text-text1 transition flex gap-2 items-center"
            onClick={onClose}
          >
            <button className=" bg-bg-small rounded-2xl p-2 h-fit w-fit ">
              <Bird size={20} color={"gray"} />
            </button>
            Tweets
          </Link>

          <Link
            to={`/Dashboard/${user?._id}`}
            className="py-2 px-3 rounded-lg text-text hover:bg-blue-50 hover:text-text1 transition flex gap-2 items-center"
            onClick={onClose}
          >
            <button className=" bg-bg-small rounded-2xl p-2 h-fit w-fit ">
              <Menu color="gray" size={20} />
            </button>{" "}
            Dashboard
          </Link>
          <div className="p-4 mt-4">
            <div className="bg-[#f8f9fa] rounded-xl shadow-md p-4 flex flex-col items-center text-center">
              {/* Profile Image */}
              <img
                src={Arpith}
                alt="Arpith Paliwal"
                className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-[#0175FE]"
              />

              {/* Name */}
              <h2 className="text-xl font-semibold text-gray-800">
                Arpith Paliwal
              </h2>

              {/* Divider */}
              <div className="w-10 border-b border-gray-300 my-2"></div>

              {/* Social Links */}
              <div className="flex flex-col gap-2 w-full">
                <a
                  href="https://instagram.com/yourprofile"
                  target="_blank"
                  className="flex items-center gap-3 bg-white p-2 rounded-lg shadow hover:bg-blue-50 transition"
                >
                  <img src={instagramIcon} className="w-5 h-5" />
                  <span className="text-sm">Instagram</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/arpith-paliwal-766161219/"
                  target="_blank"
                  className="flex items-center gap-3 bg-white p-2 rounded-lg shadow hover:bg-blue-50 transition"
                >
                  <img src={linkedinIcon} className="w-5 h-5" />
                  <span className="text-sm">LinkedIn</span>
                </a>

                <a
                  href=""
                  target="_blank"
                  className="flex items-center gap-3 bg-white p-2 rounded-lg shadow hover:bg-blue-50 transition"
                >
                  <img src={resumeIcon} className="w-5 h-5" />
                  <span className="text-sm">Portfolio</span>
                </a>

                <a
                  href="mailto:arpithpaliwal@gmail.com"
                  className="flex items-center gap-3 bg-white p-2 rounded-lg shadow hover:bg-blue-50 transition"
                >
                  <img src={communicationIcon} className="w-5 h-5" />
                  <span className="text-sm">Email</span>
                </a>
              </div>
            </div>
          </div>
          <Link
            to={"/Settings"}
            className="py-2 px-3 rounded-lg text-text hover:bg-blue-50 hover:text-text1 transition flex gap-2 items-center"
            onClick={onClose}
          >
            <button className=" bg-bg-small  rounded-2xl p-2 h-fit w-fit ">
              <Settings color="gray" size={20} />
            </button>
            Settings
          </Link>

          <button
            className="bg-red-500 text-white rounded-2xl p-2 px-4 cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
        {/* CREATOR CARD */}
      </div>
    </>
  );
}
