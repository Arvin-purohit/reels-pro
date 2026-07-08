import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
  try {
    await connectToDatabase();

    const videos = await Video.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body: IVideo = await request.json();
    console.log("Incoming Body:", body);
    if (
      !body.title ||
      !body.description ||
      !body.videoUrl 
      
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    console.log("Creating Video...");

    const newVideo = await Video.create({
      ...body,
      controls: body.controls ?? true,
      transformation: {
        width: 1080,
        height: 1920,
        quality: body.transformations?.quality ?? 100,
      },
    });

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
  console.error("POST /api/videos Error:", error);

  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : "Failed to create video",
    },
    { status: 500 }
  );
}
}