import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Toast from "../../Utils/Toast";
import { useMutation } from "@tanstack/react-query";
import { createFormData } from "../../Utils/createFormData";
import { editVideo, uploadVideo } from "../../API/videoApi";
import { useQueryClient } from "@tanstack/react-query";


function VideoForm({ title, description, mode, videoId, userId }) {
  
const queryClient = useQueryClient()
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      title: title || "",
      description:description || ""
    },
  });

  const createOrEdit = mode == "create" 
  const Mutation = useMutation({
    mutationFn: (formDataToSend) => {
      switch (mode) {
        case "create":
          return uploadVideo(formDataToSend);
        case "edit":
          return editVideo(videoId, formDataToSend);
      }
    },
    onSuccess: async (data) => {
      

      setToast({ type: "success", message: "video uploaded  successfully!" });
      await queryClient.invalidateQueries(["All Videos", userId]);

      navigate(`/DashBoard/${userId}`);
    },
    onError: (error) => {
      setToast({ type: "error", message: error.message });
      reset();
    },
  });
  const onSubmit = async (data) => {
    
   
    const formDataToSend = createFormData(data);
    return Mutation.mutateAsync(formDataToSend);
  };

  return (
    <div>
      <div className="w-full h-20 bg-background  ">
        <button
          className="text-white px-5 py-1.5 bg-[#0175FE] m-5 rounded-2xl lg:ml-50 lg:mt-25"
          onClick={() => navigate(`/DashBoard/${userId}`)}
        >
          Back
        </button>
      </div>

      <div className="flex justify-center items-center bg-background  overflow-hidden p-4">
        <div className="w-full max-w-md bg-accent border border-[#0175FE]/30 p-7 rounded-2xl shadow-lg  ">
          <h1 className="text-[#0175FE] text-4xl font-bold text-center mb-3 ">
            {createFormData ? "Upload To Nexora" : "Edit Video"}
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-text1 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                placeholder="Enter video title"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0175FE] text-text"
                {...register("title", {
                  required: "title is required",
                  minLength: {
                    value: 2,
                    message: "title must be at least 2 characters long",
                  },
                })}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-text1 mb-1"
              >
                Description
              </label>
              <textarea
                type="text"
                id="description"
                rows={10}
                placeholder="Enter your description"
                className="w-full h-60 border border-gray-300 rounded-lg px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-[#0175FE]"
                {...register("description", {
                  required: "Email is required",
                })}
              />
              
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {createOrEdit && (
              <div>
                <label
                  htmlFor="videoFile"
                  className="block text-sm font-semibold text-text1 mb-1"
                >
                  Video File
                </label>

                <input
                  type="file"
                  id="videoFile"
                  accept="video/*"
                  className="w-full text-sm text-text1 border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-[#0175FE]"
                  {...register("videoFile", {
                    required: "Video file is required",
                    validate: {
                      acceptedFormats: (fileList) =>
                        fileList &&
                        fileList[0] &&
                        ["video/mp4", "video/webm", "video/ogg"].includes(
                          fileList[0].type
                        )
                          ? true
                          : "Only MP4, WebM, or OGG videos are allowed",
                      fileSize: (fileList) =>
                        fileList &&
                        fileList[0] &&
                        fileList[0].size <= 50 * 1024 * 1024 // 50MB limit
                          ? true
                          : "Video must be smaller than 50MB",
                    },
                  })}
                />

                {errors.videoFile && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.videoFile.message}
                  </p>
                )}
              </div>
            )}
            <div>
              <label
                htmlFor="thumbnail"
                className="block text-sm font-semibold text-text1 mb-1"
              >
                Thumbnail
              </label>
              <input
                type="file"
                id="thumbnail"
                accept="image/*"
                className="w-full text-sm text-text1 border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-[#0175FE]"
                {...register("thumbnail", {
                  required: false,
                  validate: {
                    acceptedFormats: (fileList) =>
                      (fileList &&
                        fileList[0] &&
                        ["image/jpeg", "image/png", "image/webp"].includes(
                          fileList[0].type
                        )) ||
                      (!createOrEdit && fileList.length == 0)
                        ? true
                        : "Only JPEG, PNG, or WEBP images are allowed",
                    fileSize: (fileList) =>
                      (fileList &&
                        fileList[0] &&
                        fileList[0].size <= 4 * 1024 * 1024) ||
                      (!createOrEdit && fileList.length == 0)
                        ? true
                        : "File must be smaller than 4MB",
                  },
                })}
              />
              {errors.thumbnail && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.thumbnail.message}
                </p>
              )}
            </div>
            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0175FE] hover:bg-[#0163D2] text-white font-semibold py-2 rounded-lg transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "uploading..." : "upload"}
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
    </div>
  );
}

export default VideoForm;
