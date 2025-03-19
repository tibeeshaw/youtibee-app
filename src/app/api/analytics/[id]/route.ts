import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {  
    try {
    // Get cookies from the request
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const id = (await params).id;

    // Call YouTube API with authentication
    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${id}&key=${API_KEY}`);

    if (!response.ok) {
        console.error("error", await response.json());
      return NextResponse.json({ error: "Failed to fetch playlists" }, { status: response.status  });
    }

    const data = await response.json();
    console.log("data", JSON.stringify(data));

    return NextResponse.json(data.items[0].statistics);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
