import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {  
  const session  =await getServerSession();
  if(session){

  try {

    const headersO = await headers();

    const tokenHeader = headersO.get("authorization");

    if(!tokenHeader){
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }
    
    const videoId = (await params).id;

    const baseUrl = process.env.DOWNLOAD_URL;

    if(videoId === 'rate') {
      const response = await fetch(`${baseUrl}/rate-limit`, {
        headers: {
          Authorization: tokenHeader,
        },
      });

      const data = await response.json();
      console.log("rate-limit", data);
   
      return NextResponse.json(data);
    }

    const secret = Buffer.from(process.env.DOWNLOAD_SECRET || "", "utf-8").toString("base64");

    const url = `${baseUrl}/download/audio?url=https://www.youtube.com/watch?v=${videoId}&secret=${secret}`

      // Fetch the binary content
      const response = await fetch(url, {
        headers: {
          Authorization: tokenHeader,
        },
      });

      if (!response.ok) {
        return NextResponse.json({ error: "Failed to fetch file" }, { status: response.status });
      }
  
      // Stream the response to the client
      const resHeaders = new Headers(response.headers);
      return new NextResponse(response.body, { headers: resHeaders });


  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
  
} else {
  return NextResponse.json({ error: "No session found" }, { status: 401 });
}
}
