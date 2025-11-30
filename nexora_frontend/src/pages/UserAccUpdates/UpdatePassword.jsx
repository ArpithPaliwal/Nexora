import React from "react";

import { useNavigate } from "react-router-dom";
import UpdatePasswordForm from "../../Components/Settings/UpdatePasswordForm";


function UpdatePassword() {
  const navigate = useNavigate();
  return (
    <div className="h-fit flex flex-col  items-center gap-5 pt-30 w-full">
      <UpdatePasswordForm />
      <button
        className="text-white px-5 py-1.5 bg-[#0175FE]  rounded-2xl w-30 cursor-pointer"
        onClick={() => navigate("/Home")}
      >
        Back
      </button>
    </div>
  );
}

export default UpdatePassword;
