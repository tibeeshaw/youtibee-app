import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Get cookies from the request
    const headersO = await headers();

    const accessToken = headersO.get("authorization")?.replace("Bearer ", "");

    // Call YouTube API with authentication
    const response = await fetch("https://www.googleapis.com/youtube/v3/videos?part=snippet&myRating=like", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
        console.error("error", await response.json());
      return NextResponse.json({ error: "Failed to fetch liked videos" }, { status: response.status  });
    }

    const data = await response.json();
    console.log("data", data);

    return NextResponse.json(data.items || []);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
