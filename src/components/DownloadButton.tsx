import { useState } from "react";

export default function DownloadButton({ videoId, videoTitle, disabled }: { videoId: string, videoTitle: string, disabled: boolean }) {
    const [loading, setLoading] = useState(false);

    const baseUrl = `https://youtibee-api-v2.onrender.com`;
    // const baseUrl = `http://localhost:5001`;

    const url = `${baseUrl}/download/audio?url=https://www.youtube.com/watch?v=${videoId}`


    const handleDownload = async () => {
        setLoading(true);
        const response = await fetch(url, {
            method: "GET",
        });
        if (response.status === 200) {
            const blob = await response.blob();
            const link = document.createElement("a");

            link.href = window.URL.createObjectURL(blob);
            response.headers.forEach(console.log);
            const contentDisposition = response.headers.get("Content-Disposition");
            const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
            const filename = filenameMatch ? filenameMatch[1] : `${videoTitle}.m4a`;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.error(response);
        }

        setLoading(false);
    };

    return (
        <button onClick={handleDownload} disabled={loading || disabled}>
            {loading ? "Downloading..." : "Download as MP3"}
        </button>
    );
}
