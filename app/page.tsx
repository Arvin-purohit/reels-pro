'use client'
import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/video";
import { useEffect, useState } from "react";
import VideoFeed from "./components/VideoFeed";

export default function Home() {

  const [videos , setVideos] = useState<IVideo[]>([])

  useEffect( () => {
    const fetchVideos = async () => {
      try {
       const data = await apiClient.getVideos()
       setVideos(data)
      } catch (error) {
        console.error('Error Fetching Videos', error)
      }
    }
    fetchVideos()
  } , [])


  return (
   <main className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-8" >ReelsPro</h1>
    <VideoFeed videos={videos} />
   </main>
  );
}
