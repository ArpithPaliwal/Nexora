import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import Toast from "../../Utils/Toast";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../API/SettingsApi";

function UpdatePasswordForm() {
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Mutation
  const Mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setToast({ type: "success", message: "Password updated successfully!" });
      navigate("/Home");
    },
    onError: (error) => {
      setToast({ type: "error", message: error.message });
      reset();
    },
  });

  const onSubmit = async (data) => {
    return Mutation.mutateAsync(data);
  };

  return (
    <div className="flex justify-center items-center w-full ">
      <div className="w-full max-w-md bg-accent border border-[#0175FE]/30 p-5 rounded-2xl shadow-lg">
        <h1 className="text-[#0175FE] text-4xl font-bold text-center mb-4">
          Nexora
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* OLD PASSWORD */}
          <div>
            <label
              htmlFor="oldPassword"
              className="block text-sm font-semibold text-text mb-1"
            >
              Old Password
            </label>

            <input
              type="password"
              id="oldPassword"
              placeholder="Enter your old password"
              className="w-full border text-text  border-gray-300 rounded-lg px-3 py-2 
                         focus:outline-none focus:ring-2 focus:ring-[#0175FE]"
              {...register("oldPassword", {
                required: "Old password is required",
              })}
            />

            {errors.oldPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          {/* NEW PASSWORD */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-semibold text-text mb-1"
            >
              New Password
            </label>

            <input
              type="password"
              id="newPassword"
              placeholder="Enter your new password"
              className="w-full border text-text border-gray-300 rounded-lg px-3 py-2 
                         focus:outline-none focus:ring-2 focus:ring-[#0175FE]"
              {...register("newPassword", {
                required: "New password is required",
              })}
            />

            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0175FE] hover:bg-[#0163D2] text-white 
                       font-semibold py-2 rounded-lg transition duration-300 
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>

        {/* Toast */}
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}

export default UpdatePasswordForm;
