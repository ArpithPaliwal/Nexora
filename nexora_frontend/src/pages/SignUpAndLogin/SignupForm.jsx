import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { registerUser } from "../../API/userApi";
import { createFormData } from "../../Utils/createFormData";
import Toast from "../../Utils/Toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/authSlice/authSlice";

function SignupForm() {
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
    mutationFn: registerUser,
    onSuccess: (data) => {
      
      dispatch(login({userData:data.user}))
      setToast({ type: "success", message: "User registered successfully!" });
      navigate("/Home");
    },
    onError: (error) => {
      console.error("Signup failed becuaseeee:", error);
      
      setToast({ type: "error", message: error.message });
      reset()
    },
  });

  const onSubmit = async (data) => {
   
    const formDataToSend = createFormData(data);
    return Mutation.mutateAsync(formDataToSend);
  };

  return (
    <div className="relative flex justify-center items-center bg-background  overflow-hidden p-4">
      <button
          className="  absolute top-5 left-5 text-white px-5 py-1.5  bg-[#0175FE] m-5 rounded-2xl"
          onClick={() => navigate(`/`)}
        >
          Back
      </button>
      <div className="w-full max-w-md bg-accent border border-[#0175FE]/30 p-7 rounded-2xl shadow-lg ">
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
              className="w-full border border-gray-300 rounded-lg  text-text px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0175FE]"
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-[#0175FE]"
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
              className="w-full border border-gray-300 rounded-lg px-3  text-text py-2 focus:outline-none focus:ring-2 focus:ring-[#0175FE]"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
                pattern: {
                  value:
                    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                  message:
                    "Password must include an uppercase letter, number & special character",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Images */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-semibold text-text mb-1"
              >
                Avatar Image
              </label>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                className="w-full text-sm  border text-text border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-[#0175FE]"
                {...register("avatar", {
                  required: "Avatar image is required",
                  validate: {
                    acceptedFormats: (fileList) =>
                      fileList &&
                      fileList[0] &&
                      ["image/jpeg", "image/png", "image/webp"].includes(
                        fileList[0].type
                      )
                        ? true
                        : "Only JPEG, PNG, or WEBP images are allowed",
                    fileSize: (fileList) =>
                      fileList &&
                      fileList[0] &&
                      fileList[0].size <= 2 * 1024 * 1024
                        ? true
                        : "File must be smaller than 2MB",
                  },
                })}
              />
              {errors.avatar && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.avatar.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="coverImage"
                className="block text-sm font-semibold text-text mb-1"
              >
                Cover Image
              </label>
              <input
                type="file"
                id="coverImage"
                accept="image/*"
                className="w-full text-sm text-text border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-[#0175FE]"
                {...register("coverImage", {
                  validate: {
                    acceptedFormats: (fileList) =>
                      fileList &&
                      fileList[0] &&
                      ["image/jpeg", "image/png", "image/webp"].includes(
                        fileList[0].type
                      )
                        ? true
                        : "Only JPEG, PNG, or WEBP images are allowed",
                    fileSize: (fileList) =>
                      fileList &&
                      fileList[0] &&
                      fileList[0].size <= 5 * 1024 * 1024
                        ? true
                        : "File must be smaller than 5MB",
                  },
                })}
              />
              {errors.coverImage && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.coverImage.message}
                </p>
              )}
            </div>
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

export default SignupForm;
