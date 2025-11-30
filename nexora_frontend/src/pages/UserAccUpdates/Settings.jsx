import { Link, useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background p-6 pt-20">
      {/* Header */}
      <h1 className=" text-3xl md:text-5xl font-bold text-[#0175FE] text-center mb-10">
        Nexora Settings
      </h1>

      {/* Card Container */}
      <div className=" w-70  mx-auto grid grid-cols-1 gap-5 lg:w-100">
        {/* Update Avatar */}
        <Link
          to="UpdateAvatar"
          className="bg-accent text-text shadow-md rounded-xl p-5 text-xl font-semibold hover:bg-blue-50 hover:text-text1 transition cursor-pointer"
        >
          Update Avatar
        </Link>

        {/* Update Cover Image */}
        <Link
          to="UpdateCoverImage"
          className="bg-accent text-text shadow-md rounded-xl p-5 text-xl font-semibold hover:bg-blue-50 hover:text-text1 transition cursor-pointer"
        >
          Update Cover Image
        </Link>

        {/* Update Account Details */}
        <Link
          to="UpdateAccDetails"
          className="bg-accent text-text shadow-md rounded-xl p-5 text-xl font-semibold hover:bg-blue-50 hover:text-text1 transition cursor-pointer"
        >
          Update Account Details
        </Link>

        {/* Update Password */}
        <Link
          to="UpdatePassword"
          className="bg-accent text-text shadow-md rounded-xl p-5 text-xl font-semibold hover:bg-blue-50 hover:text-text1 transition cursor-pointer"
        >
          Update Password
        </Link>
        <button
          className="text-white px-5 py-1.5 bg-[#0175FE]  rounded-2xl w-full cursor-pointer"
          onClick={() => navigate("/Home")}
        >
          Back
        </button>
      </div>
    </div>
  );
}
