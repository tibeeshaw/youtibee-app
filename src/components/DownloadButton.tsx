import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";

export default function DownloadButton({ videoId }: { videoId: string }) {
    const [loading, setLoading] = useState(false);
    const session = useSession();
    const token = useMemo(() => session.data?.user.accessToken, [session]);



    const handleDownload = async () => {
        setLoading(true);
        const response = await fetch(`/api/youtube/download/audio?id=${videoId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            const blob = await response.blob();
            const link = document.createElement("a");

            link.href = window.URL.createObjectURL(blob);
            link.download = "audio.mp3";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.error(response);
        }

        setLoading(false);
    };

    return (
        <button onClick={handleDownload} disabled={loading}>
            {loading ? "Downloading..." : "Download as MP3"}
        </button>
    );
}
