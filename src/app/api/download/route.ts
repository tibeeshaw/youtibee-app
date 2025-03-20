import { NextResponse } from "next/server";

export async function GET(
  request: Request,
) {  

  try {

    const baseUrl = process.env.DOWNLOAD_URL;
    const url = `${baseUrl}/ping`

   const response = await fetch(url);

   const data = await response.json();
   console.log("ping", data);

   return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

}
