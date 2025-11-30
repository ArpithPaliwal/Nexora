import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { createFormData } from "../../Utils/createFormData";
import Toast from "../../Utils/Toast";
import { useNavigate } from "react-router-dom";
import { updateCoverImage } from "../../API/SettingsApi";



function UpdateCoverImageForm() {
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const Mutation = useMutation({
    mutationFn: updateCoverImage,
    onSuccess: (data) => {

      
      setToast({ type: "success", message: "Avatar Updated Succesfully" });
      navigate("/Home");
    },
    onError: (error) => {
     
      
      setToast({ type: "error", message: error.message });
      reset()
    },
  });

  const onSubmit = async (data) => {
    
    const formDataToSend = createFormData(data);
    return Mutation.mutateAsync(formDataToSend);
  };

  return (
    <div className="flex justify-center items-center   overflow-hidden p-4">
      <div className="w-full max-w-md bg-accent border border-[#0175FE]/30 p-7 rounded-2xl shadow-lg  ">
        <h1 className="text-[#0175FE] text-4xl font-bold text-center mb-3 ">
          Nexora
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 ">
          

          {/* Images */}
          <div >
            <div>
              <label
                htmlFor="coverImage"
                className="block text-sm font-semibold text-text mb-1"
              >
                CoverImage
              </label>
              <input
                type="file"
                id="coverImage"
                accept="image/*"
                className="  md:w-100 text-sm text-text1 border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-[#0175FE]"
                {...register("coverImage", {
                  required: "Coverimage is required",
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

            
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0175FE] hover:bg-[#0163D2] text-white font-semibold py-2 rounded-lg transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Update"}
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

export default UpdateCoverImageForm;
