'use client'
import { Video } from "@imagekit/next";
import Link from "next/link";
import { IVideo , IComment } from "@/models/video";
import { Heart, MessageCircle, Send, Share2, User } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";

export default function VideoComponent({ video }: { video: IVideo }) {

const [shareMessage, setShareMessage] = useState("");

const [comments, setComments] = useState<IComment[]>(
  video.comments ?? []
);

const [commentText, setCommentText] = useState("");

const [showComments, setShowComments] = useState(false);

const [isCommenting, setIsCommenting] = useState(false);

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

const handleComment = async () => {
  if (!video._id) return;

  if (!userId) {
    alert("Please login to comment on this reel.");
    return;
  }

  if (!commentText.trim()) {
    return;
  }

  if (isCommenting) return;

  try {
    setIsCommenting(true);

    const response = await apiClient.addComment(
      video._id.toString(),
      commentText
    );

    setComments((previousComments) => [
      ...previousComments,
      response.comment,
    ]);

    setCommentText("");
  } catch (error) {
    console.error("Failed to add comment:", error);
    alert("Failed to add comment.");
  } finally {
    setIsCommenting(false);
  }
};
const handleShare = async () => {
  if (!video._id) return;

  const shareUrl = `${window.location.origin}/videos/${video._id}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: video.title,
        text: video.description,
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);

      setShareMessage("Link copied!");

      setTimeout(() => {
        setShareMessage("");
      }, 2000);
    }
  } catch (error) {
    console.error("Failed to share reel:", error);
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
  onClick={() => setShowComments((previous) => !previous)}
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

  <span className="text-sm font-medium">
    {comments.length}
  </span>
</button>

      <button
  type="button"
  onClick={handleShare}
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

  <span className="text-sm font-medium">
    {shareMessage || "Share"}
  </span>
</button>
      </div>

      {showComments && (
  <div className="border-b border-gray-200 p-4 dark:border-slate-700">
    {/* Existing comments */}
    <div className="mb-4 max-h-48 space-y-3 overflow-y-auto">
      {comments.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        comments.map((comment, index) => (
          <div
            key={`${comment.userId}-${index}`}
            className="rounded-xl bg-gray-100 p-3 dark:bg-slate-800"
          >
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              ReelsPro User
            </p>

            <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">
              {comment.text}
            </p>
          </div>
        ))
      )}
    </div>

    {/* Add comment */}
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={commentText}
        onChange={(event) => setCommentText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleComment();
          }
        }}
        placeholder="Write a comment..."
        className="
          min-w-0
          flex-1
          rounded-xl
          border
          border-gray-300
          bg-white
          px-4
          py-2
          text-sm
          text-slate-900
          outline-none
          transition
          focus:border-indigo-500
          focus:ring-2
          focus:ring-indigo-500/20
          dark:border-slate-600
          dark:bg-slate-800
          dark:text-white
          dark:placeholder:text-slate-400
        "
      />

      <button
        type="button"
        onClick={handleComment}
        disabled={!commentText.trim() || isCommenting}
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-indigo-600
          text-white
          transition
          hover:bg-indigo-700
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        <Send size={18} />
      </button>
    </div>
  </div>
)}

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