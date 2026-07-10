import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { id } = await params;
    const userId = session.user.id;

const video = await Video.findById(id);

if (!video) {
  return NextResponse.json(
    { error: "Video not found" },
    { status: 404 }
  );
}

const likes: string[] = video.likes ?? [];
console.log("Current user ID:", userId);
console.log("Existing likes:", likes);

const alreadyLiked = likes.some(
  (likedUserId: string) =>
    likedUserId.toString() === userId.toString()
);

if (alreadyLiked) {
  video.likes = likes.filter(
    (likedUserId: string) =>
      likedUserId.toString() !== userId.toString()
  );
} else {
  video.likes = [...likes, userId];
}

await video.save();

const savedVideo = await Video.findById(id);

console.log("Likes after save:", video.likes);
console.log("Likes from database:", savedVideo?.likes);

return NextResponse.json(
  {
    liked: !alreadyLiked,
    likesCount: video.likes.length,
    likes: video.likes,
  },
  { status: 200 }
);
  } catch (error) {
   console.error("Like video error:", error);

  return NextResponse.json(
    {
      error:
        error instanceof Error
          ? error.message
          : "Failed to update like",
    },
    { status: 500 })
  }
}