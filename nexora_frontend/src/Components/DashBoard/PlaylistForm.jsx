import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Toast from "../../Utils/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFormData } from "../../Utils/createFormData";
import { createPlaylist, editPlaylist } from "../../API/PlaylistApi";


function PlaylistForm({ mode, playlistId, userId, name, description }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [toast, setToast] = useState(null);

  const isCreate = mode === "create";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: name || "",
      description: description || "",
    },
  });

  // React Query Mutation
  const mutation = useMutation({
    mutationFn: (formDataToSend) => {
      if (isCreate) {
        return createPlaylist(formDataToSend);
      } else {
        return editPlaylist(playlistId, formDataToSend);
      }
    },
    onSuccess: async () => {
      setToast({
        type: "success",
        message: isCreate
          ? "Playlist created successfully!"
          : "Playlist updated successfully!",
      });

      // Invalidate playlist queries
      await queryClient.invalidateQueries({queryKey:["Playlist", userId]});

      navigate(`/DashBoard/${userId}`);
    },
    onError: (error) => {
      setToast({ type: "error", message: error.message });
      reset();
    },
  });

const onSubmit = useCallback(async (formData) => {
  if (isCreate) {
    const finalFormData = createFormData(formData);
    await mutation.mutateAsync(finalFormData);
  } else {
    await mutation.mutateAsync(formData);
  }
}, [isCreate, mutation]);



  return (
    <div className="w-140 ">
      {/* Top Bar */}
      <div className="w-full h-20 ">
        <button
          className="text-white px-5 py-1.5 bg-[#0175FE] m-5 rounded-2xl"
          onClick={() => navigate(`/DashBoard/${userId}`)}
        >
          Back
        </button>
      </div>

      <div className="flex justify-center items-center p-4 ">
        <div className="w-full  bg-accent border border-[#0175FE]/30 p-7 rounded-2xl shadow-lg ">
          <h1 className="text-[#0175FE] text-4xl font-bold text-center mb-3">
            {isCreate ? "Create Playlist" : "Edit Playlist"}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {/* NAME */}
            <div>
              <label className="block text-sm font-semibold text-text mb-1">
                Playlist Name
              </label>
              <input
                type="text"
                placeholder="Enter playlist name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-[#0175FE]"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-semibold text-text  mb-1">
                Description
              </label>
              <textarea
                placeholder="Enter description (max 300 characters)"
                rows={5}
                className="w-full border border-gray-300 rounded-lg text-text px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0175FE]"
                {...register("description", {
                  maxLength: {
                    value: 300,
                    message: "Description cannot exceed 300 characters",
                  },
                })}
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* COVER IMAGE — ONLY IN CREATE MODE */}
            {isCreate && (
              <div>
                <label className="block text-sm font-semibold text-text mb-1">
                  Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-text border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-[#0175FE]"
                  {...register("coverImage", {
                    required: "Cover image is required",
                    validate: {
                      acceptedFormats: (fileList) =>
                        fileList &&
                        fileList[0] &&
                        ["image/jpeg", "image/png", "image/webp"].includes(
                          fileList[0].type
                        )
                          ? true
                          : "Only JPEG, PNG, or WEBP allowed",
                      fileSize: (fileList) =>
                        fileList &&
                        fileList[0] &&
                        fileList[0].size <= 5 * 1024 * 1024
                          ? true
                          : "Image must be smaller than 5MB",
                    },
                  })}
                />
                {errors.coverImage && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.coverImage.message}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0175FE] hover:bg-[#0163D2] text-white font-semibold py-2 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? isCreate
                  ? "Creating..."
                  : "Updating..."
                : isCreate
                ? "Create Playlist"
                : "Update Playlist"}
            </button>
          </form>
        </div>

        {/* Toast Notification */}
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

export default PlaylistForm;
