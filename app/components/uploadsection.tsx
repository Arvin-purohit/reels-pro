"use client";

import { useState } from "react";
import FileUpload from "./FileUpload";
import { apiClient } from "@/lib/api-client";

interface UploadSectionProps {
  onVideoPublished: () => void;
}

export default function UploadSection({onVideoPublished,} : UploadSectionProps) {
  const [caption, setCaption] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

const handlePublish = async () => {
  if (!caption.trim()) {
    alert("Please enter a caption.");
    return;
  }

  if (!videoUrl) {
    alert("Please upload a video first.");
    return;
  }

  try {
    const newVideo = await apiClient.createVideo({
      title: caption,
      description: caption,
      videoUrl,
      thumbnailUrl: "",
    });

    console.log("Video created:", newVideo);
    console.log(
      "onVideoPublished type:",
      typeof onVideoPublished
    );

    await onVideoPublished();

    setCaption("");
    setVideoUrl("");
    setUploadProgress(0);

    alert("🎉 Reel published successfully!");
  } catch (error: any) {
    console.error("Publish Error:", error);
    alert(error.message);
  }
};


  const handleUploadSuccess = (response: any) => {
    console.log(response);

    setVideoUrl(response.url);
  };

  return (
<div
  className="
w-full
max-w-3xl

rounded-3xl

bg-white
dark:bg-slate-900

shadow-2xl

border
border-gray-200
dark:border-slate-700

p-10

transition-all
duration-300
"
>

    <div className="text-center mb-8">
  <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
  </h2>

  <p className="text-slate-600 dark:text-slate-300 mt-2">
    Upload and share your next reel
  </p>
</div>

      <textarea
  placeholder="What's happening today?"
  value={caption}
  onChange={(e) => setCaption(e.target.value)}
  rows={4}
  className="
    w-full
    rounded-xl
    border
    border-gray-300
    dark:border-slate-700
    bg-white
    dark:bg-slate-800
    p-4
    text-slate-900
    dark:text-white
    placeholder:text-gray-400
    dark:placeholder:text-slate-400
    focus:outline-none
    focus:ring-2
    focus:ring-indigo-500
    transition
  "
/>

      <FileUpload
        fileType="video"
        onSuccess={handleUploadSuccess}
        onProgress={setUploadProgress}
      />

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div>

          <p>{uploadProgress}%</p>

          <progress
            className="progress progress-primary w-full"
            value={uploadProgress}
            max="100"
          />

        </div>
      )}

      {videoUrl && (
        <video
          src={videoUrl}
          controls
          className="rounded-lg w-full"
        />
      )}

      <button
      onClick={handlePublish}
  className="
    w-full
    rounded-xl
    bg-indigo-600
    hover:bg-indigo-700
    text-white
    font-semibold
    py-3
    transition
    duration-300
    disabled:opacity-50
  "
>
  🚀 Publish Reel
</button>

    </div>
  );
}