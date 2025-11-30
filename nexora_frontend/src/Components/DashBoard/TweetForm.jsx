import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTweet, EditTweet } from "../../API/TweetApi";
import { useForm } from "react-hook-form";
import Toast from "../../Utils/Toast";
//here call backs and memo is really not needed 
function TweetForm({ userId, tweet, content, mode }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const defaultValues = useMemo(
    () => ({
      content: content || "",
    }),
    [content]
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    defaultValues,
  });
  const Mutation = useMutation({
    mutationFn: (data) => {
      switch (mode) {
        case "edit":
          return EditTweet(tweet, data);
        default:
          return createTweet(data);
      }
    },
    onSuccess: async (data) => {
      setToast({ type: "success", message: "video uploaded  successfully!" });
      await queryClient.invalidateQueries(["Tweets", userId]);

      navigate(`/DashBoard/${userId}`);
    },
    onError: (error) => {
      setToast({ type: "error", message: error.message });
    },
  });

  const onSubmit = useCallback(
    async (data) => {
      return Mutation.mutateAsync(data);
    },
    [Mutation]
  );

  const handleToastClose = useCallback(() => {
    setToast(null);
  }, []);
  return (
    <div className="w-full">
      <div className="w-full h-20 bg-background  ">
        <button
          className="text-white px-5 py-1.5 bg-[#0175FE] m-5 rounded-2xl lg:ml-50 lg:mt-25"
          onClick={() => navigate(`/DashBoard/${userId}`)}
        >
          Back
        </button>
      </div>

      <div className="flex justify-center items-center bg-background  overflow-hidden p-4">
        <div className="w-full max-w-md bg-accent border border-[#0175FE]/30 p-7 rounded-2xl shadow-lg ">
          <h1 className="text-[#0175FE] text-4xl font-bold text-center mb-3 ">
            Tweet
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-semibold text-text mb-1"
              >
                Content
              </label>
              <textarea
                type="text"
                id="content"
                rows={10}
                placeholder="Enter your description"
                className="w-full h-60 border border-gray-300 text-text rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0175FE]"
                {...register("content", {
                  required: "required",
                })}
              />

              {errors.content && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.content.message}
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
            onClose={handleToastClose}
          />
        )}
      </div>
    </div>
  );
}

export default TweetForm;
