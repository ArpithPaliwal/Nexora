import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import Toast from "../../Utils/Toast";
import { useNavigate } from "react-router-dom";

import { updateAccountDetails } from "../../API/SettingsApi";

function UpdateAccountDetails() {
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const Mutation = useMutation({
    mutationFn: updateAccountDetails,
    onSuccess: (data) => {
      
      setToast({ type: "success", message: "User registered successfully!" });
      navigate("/Home");
    },
    onError: (error) => {
      console.error("Signup failed becuaseeee:", error);
      
      setToast({ type: "error", message: error.message });
      reset();
    },
  });

  const onSubmit = (formDataToSend) => {
    return Mutation.mutateAsync(formDataToSend);
  };

  return (
    <div className="flex justify-center items-center w-full  overflow-hidden p-4 h-full">
      <div className="w-full max-w-md bg-accent border border-[#0175FE]/30 p-7 rounded-2xl shadow-lg  ">
        <h1 className="text-[#0175FE] text-4xl font-bold text-center mb-3 ">
          Nexora
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Full name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-semibold text-text mb-1"
            >
              Fullname
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter your full name"
              className="w-full border border-gray-300 text-text rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0175FE]"
              {...register("fullName", {
                 required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Full name must be at least 2 characters long",
                },
              })}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

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
              className="w-full border border-gray-300 text-text rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0175FE]"
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

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0175FE] hover:bg-[#0163D2] text-white font-semibold py-2 rounded-lg transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "updating..." : "Update"}
          </button>
        </form>
      </div>

      {/* Toast popup */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default UpdateAccountDetails;
