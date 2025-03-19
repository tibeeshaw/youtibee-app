import { motion } from "framer-motion";
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
        <motion.button
            onClick={handleDownload}
            disabled={loading || disabled}
            className={`cursor-pointer px-2.5 py-1.5 rounded text-sm text-white font-medium  flex items-center gap-1 ${loading || disabled
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg"
                }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {loading ? (
                <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Downloading...
                </>
            ) : (
                <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                    </svg>
                    Download
                </>
            )}
        </motion.button>
    );
}
