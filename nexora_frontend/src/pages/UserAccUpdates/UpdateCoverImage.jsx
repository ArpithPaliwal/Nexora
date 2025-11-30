import React from "react";

import { useNavigate } from "react-router-dom";
import UpdateCoverImageForm from "../../Components/Settings/UpdateCoverImageForm";

function UpdateCoverImage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center pt-20 w-full">
      <UpdateCoverImageForm />
      <button
        className="text-white px-5 py-1.5 bg-[#0175FE]  rounded-2xl w-30 cursor-pointer"
        onClick={() => navigate("/Home")}
      >
        Back
      </button>
    </div>
  );
}

export default UpdateCoverImage;
