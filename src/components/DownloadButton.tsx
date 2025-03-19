// import { useSession } from "next-auth/react";
// import { useMemo, useState } from "react";

export default function DownloadButton({ videoId }: { videoId: string }) {
    // const [loading, setLoading] = useState(false);
    // const session = useSession();
    // const token = useMemo(() => session.data?.user.accessToken, [session]);

    const baseUrl = `https://youtibee-api-v2.onrender.com`;
    // const baseUrl = `http://localhost:5001`;

    const url = `${baseUrl}/download/audio?url=https://www.youtube.com/watch?v=${videoId}`


    // const handleDownload = async () => {
    //     setLoading(true);
    //     const response = await fetch(url, {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //     });
    //     if (response.status === 200) {
    //         const blob = await response.blob();
    //         const link = document.createElement("a");

    //         link.href = window.URL.createObjectURL(blob);
    //         const contentDisposition = response.headers.get("content-disposition");
    //         const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
    //         const filename = filenameMatch ? filenameMatch[1] : "audio.mp3";
    //         link.download = filename;
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //     } else {
    //         console.error(response);
    //     }

    //     setLoading(false);
    // };

    return (
        // <button onClick={handleDownload} disabled={loading}>
        //     {loading ? "Downloading..." : "Download as MP3"}
        // </button>
        <a href={url} >
        {"Download as MP3"}
    </a>
    );
}
