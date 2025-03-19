import { Playlist } from "@/app/home";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Get cookies from the request
    const headersO = await headers();

    const accessToken = headersO.get("authorization")?.replace("Bearer ", "");

    // Call YouTube API with authentication
    const response = await fetch("https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&maxResults=50", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
        console.error("error", await response.json());
      return NextResponse.json({ error: "Failed to fetch playlists" }, { status: response.status  });
    }

    const data: {items: Playlist[]} = await response.json();
    console.log("data", data);

    const res = data.items.sort((a, b) => new Date(b.snippet.publishedAt).getTime() - new Date(a.snippet.publishedAt).getTime());;

    return NextResponse.json(res);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
