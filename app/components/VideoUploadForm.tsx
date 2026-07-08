"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { UploadResponse } from "@imagekit/next";
import { useNotification } from "./Notification";
import FileUpload from "./FileUpload";
import { apiClient, VideoFormData } from "@/lib/api-client";



export default function VideoUploadForm() {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { showNotification } = useNotification();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<VideoFormData>({
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
    },
  });

  const handleUploadSuccess = (response: UploadResponse) => {
  if (!response.filePath) {
    showNotification("Upload failed", "error");
    return;
  }

  setValue("videoUrl", response.filePath);
  setValue("thumbnailUrl", response.thumbnailUrl ?? response.filePath);

  showNotification("Video uploaded successfully!", "success");
};

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const onSubmit = async (data: VideoFormData) => {
    if (!data.videoUrl) {
      showNotification("Please upload a video first", "error");
      return;
    }

    setLoading(true);

    try {
      await apiClient.createVideo(data);

      showNotification("Video published successfully!", "success");

      reset();
      setUploadProgress(0);
    } catch (error) {
      showNotification(
        error instanceof Error
          ? error.message
          : "Failed to publish video",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Title</span>
        </label>

        <input
          type="text"
          className={`input input-bordered ${
            errors.title ? "input-error" : ""
          }`}
          {...register("title", {
            required: "Title is required",
          })}
        />

        {errors.title && (
          <span className="text-error text-sm mt-1">
            {errors.title.message}
          </span>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Description</span>
        </label>

        <textarea
          className={`textarea textarea-bordered h-24 ${
            errors.description ? "textarea-error" : ""
          }`}
          {...register("description", {
            required: "Description is required",
          })}
        />

        {errors.description && (
          <span className="text-error text-sm mt-1">
            {errors.description.message}
          </span>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Upload Video</span>
        </label>

      <FileUpload
  fileType="video"
  onSuccess={handleUploadSuccess}
  onProgress={handleUploadProgress}
  
/>


        {uploadProgress > 0 && (
          <progress
            className="progress progress-primary w-full mt-3"
            value={uploadProgress}
            max={100}
          />
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading || uploadProgress < 100}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Publishing...
          </>
        ) : (
          "Publish Video"
        )}
      </button>
    </form>
  );
}