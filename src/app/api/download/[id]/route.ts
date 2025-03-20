import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {  
  const session  =await getServerSession();
  if(session){

  try {

    const videoId = (await params).id;

    const baseUrl = process.env.DOWNLOAD_URL;
    const secret = Buffer.from(process.env.DOWNLOAD_SECRET || "", "utf-8").toString("base64");

    const url = `${baseUrl}/download/audio?url=https://www.youtube.com/watch?v=${videoId}&secret=${secret}`

      // Fetch the binary content
      const response = await fetch(url);

      if (!response.ok) {
        return NextResponse.json({ error: "Failed to fetch file" }, { status: response.status });
      }
  
      // Stream the response to the client
      const headers = new Headers(response.headers);
      return new NextResponse(response.body, { headers });


  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
  
} else {
  return NextResponse.json({ error: "No session found" }, { status: 401 });
}
}
