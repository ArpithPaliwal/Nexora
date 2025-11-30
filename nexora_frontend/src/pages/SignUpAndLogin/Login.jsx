import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { loginUser } from "../../API/userApi";
import Toast from "../../Utils/Toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/authSlice/authSlice";


function Loign() {
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const Mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      
      dispatch(login({userData:data.user}))
      setToast({ type: "success", message: "login successfull!" });
      navigate("/Home");
    },
    onError: (error) => {
      console.error("Signup failed:", error);
      setToast({ type: "error", message: error.message });
      reset();
    },
  });

  const onSubmit = async  (data) => {
   
    return Mutation.mutateAsync(data);
  };

  return (
    <div className="flex  relative justify-center  items-center h-screen  ">
      
      <button
          className="  absolute top-5 left-5 text-white px-5 py-1.5  bg-[#0175FE] m-5 rounded-2xl"
          onClick={() => navigate(`/`)}
        >
          Back
      </button>
    <div className="flex justify-center items-center  bg-background  overflow-hidden  w-100">
      
      <div className="w-full max-w-md bg-accent border border-[#0175FE]/30  p-5 rounded-2xl shadow-lg ">
        <h1 className="text-[#0175FE] text-4xl font-bold text-center ">
          Nexora
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-text mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300  text-text rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0175FE]"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-text mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              className="w-full border border-gray-300 rounded-lg text-text px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0175FE]"
              {...register("username", {
                required: "Username is required",
                validate: (value) =>
                  value === value.toLowerCase() || "Username must be lowercase",
              })}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-text mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 text-text rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0175FE]"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0175FE] hover:bg-[#0163D2] text-white font-semibold py-2 rounded-lg transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Sign Up"}
          </button>
        </form>
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
    </div>
    
  );
}

export default Loign;
