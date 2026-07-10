import { IVideo } from "@/models/video";
import VideoComponent from "./VideoComponent";

interface VideoFeedProps {
  videos: IVideo[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  if (videos.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-slate-600 dark:text-slate-400">
          No reels yet. Be the first to post one! 🎬
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-8

        sm:grid-cols-2
        lg:grid-cols-3
      "
    >
      {videos.map((video) => (
        <VideoComponent
          key={video._id?.toString()}
          video={video}
        />
      ))}
    </div>
  );
}