import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
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

    const { text } = await request.json();

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Comment cannot be empty" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const { id } = await params;

    const video = await Video.findById(id);

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    if (!video.comments) {
      video.comments = [];
    }

    video.comments.push({
      userId: session.user.id,
      text: text.trim(),
      createdAt: new Date(),
    });

    await video.save();

    const newComment =
      video.comments[video.comments.length - 1];

    return NextResponse.json(
      {
        comment: newComment,
        commentsCount: video.comments.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create comment error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create comment",
      },
      { status: 500 }
    );
  }
}