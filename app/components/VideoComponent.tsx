'use client'
import { Video } from "@imagekit/next";
import Link from "next/link";
import { IVideo } from "@/models/video";
import { Heart, MessageCircle, Share2, User } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";

export default function VideoComponent({ video }: { video: IVideo }) {
  const { data: session } = useSession();

  const [likes, setLikes] = useState<string[]>(
    video.likes ?? []
  );

  const [isLiking, setIsLiking] = useState(false);

  const userId = session?.user?.id;

  const isLiked = userId
    ? likes.includes(userId)
    : false;

  const handleLike = async () => {
  if (!video._id) return;

  if (!userId) {
    alert("Please login to like this reel.");
    return;
  }

  if (isLiking) return;

  try {
    setIsLiking(true);

    const response = await apiClient.toggleLike(
      video._id.toString()
    );

    setLikes(response.likes);
  } catch (error) {
    console.error("Failed to like reel:", error);
    alert("Failed to update like.");
  } finally {
    setIsLiking(false);
  }
};

  return (
    <article
      className="
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-md
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl

        dark:border-slate-700
        dark:bg-slate-900
      "
    >
      {/* User Header */}
      <div className="flex items-center gap-3 p-4">
        <div
          className="
            flex h-10 w-10 items-center justify-center
            rounded-full
            bg-indigo-100
            text-indigo-600
            dark:bg-indigo-500/20
            dark:text-indigo-300
          "
        >
          <User size={20} />
        </div>

        <div>
          <p className="font-semibold text-slate-900 dark:text-white">
            ReelsPro User
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Recently posted
          </p>
        </div>
      </div>

      {/* Video */}
      <Link href={`/videos/${video._id}`} className="block">
        <div
          className="
            relative
            w-full
            overflow-hidden
            bg-black
          "
          style={{ aspectRatio: "9/16" }}
        >
          <Video
            src={video.videoUrl}
            controls={video.controls ?? true}
            className="h-full w-full object-cover"
            transformation={[
              {
                width: 1080,
                height: 1920,
              },
            ]}
          />
        </div>
      </Link>

      {/* Actions */}
      <div
        className="
          flex items-center gap-6
          border-b
          border-gray-200
          px-4 py-3
          dark:border-slate-700
        "
      >
        <button
  type="button"
  onClick={handleLike}
  disabled={isLiking}
  className={`
    flex items-center gap-2
    transition
    disabled:cursor-not-allowed
    disabled:opacity-60

    ${
      isLiked
        ? "text-red-500"
        : "text-slate-600 hover:text-red-500 dark:text-slate-300 dark:hover:text-red-400"
    }
  `}
>
  <Heart
    size={22}
    fill={isLiked ? "currentColor" : "none"}
  />

  <span className="text-sm font-medium">
    {likes.length}
  </span>
</button>

        <button
          type="button"
          className="
            flex items-center gap-2
            text-slate-600
            transition
            hover:text-indigo-500
            dark:text-slate-300
            dark:hover:text-indigo-400
          "
        >
          <MessageCircle size={22} />
          <span className="text-sm font-medium">Comment</span>
        </button>

        <button
          type="button"
          className="
            ml-auto
            flex items-center gap-2
            text-slate-600
            transition
            hover:text-indigo-500
            dark:text-slate-300
            dark:hover:text-indigo-400
          "
        >
          <Share2 size={22} />
          <span className="text-sm font-medium">Share</span>
        </button>
      </div>

      {/* Caption */}
      <div className="p-4">
        <Link
          href={`/videos/${video._id}`}
          className="transition-opacity hover:opacity-80"
        >
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {video.title}
          </h2>
        </Link>

        <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
          {video.description}
        </p>
      </div>
    </article>
  );
}