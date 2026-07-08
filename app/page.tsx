"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/video";
import VideoFeed from "./components/VideoFeed";
import UploadSection from "./components/uploadsection";
import ThemeToggle from "./components/theme-toggle";

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);

  const fetchVideos = async () => {
  try {
    const data = await apiClient.getVideos();
    setVideos(data);
  } catch (error) {
    console.error("Error fetching videos:", error);
  }
};

useEffect(() => {
  fetchVideos();
}, []);

return (
  <main className="min-h-screen bg-gray-100 dark:bg-slate-950 transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white">
          ReelsPro 🎬
        </h1>

        <ThemeToggle />
      </div>

      {/* Hero */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
          Share your next amazing reel
        </h2>

        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
          Upload videos, inspire people and grow your audience.
        </p>
      </div>

      {/* Upload Card */}
      <div className="flex justify-center mb-16">
        <UploadSection />
      </div>

      {/* Feed */}
      <section className="mt-20">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Latest Reels
        </h2>

        <VideoFeed videos={videos} />
      </section>

    </div>
  </main>
)}