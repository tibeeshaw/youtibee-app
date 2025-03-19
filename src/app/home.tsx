'use client'
import DownloadButton from "@/components/DownloadButton";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type SnippetType = {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
        default: {
            url: string;
            width: number;
            height: number;
        };
        medium: {
            url: string;
            width: number;
            height: number;
        };
        high: {
            url: string;
            width: number;
            height: number;
        };
        standard: {
            url: string;
            width: number;
            height: number;
        };
        maxres: {
            url: string;
            width: number;
            height: number;
        };
    }
    channelTitle: string;
};


export type VideoType = {
    kind: string;
    etag: string;
    id: string;
    snippet: SnippetType & {
        tags: string[];
        categoryId: string;
        liveBroadcastContent: string;
        defaultLanguage: string;
        localized: {
            title: string;
            description: string;
        };
        defaultAudioLanguage: string;
    };
};

export type AnalyticsType = {
    viewCount: string;
    likeCount: string;
    favoriteCount: string;
    commentCount: string;
}

export type Playlist = {
    kind: string;
    etag: string;
    id: string;
    snippet: SnippetType & {
        localized: {
            title: string;
            description: string;
        };
    };
};


export type PlaylistItem = {
    kind: string;
    etag: string;
    id: string;
    snippet: SnippetType & {
        playlistId: string;
        position: number;
        resourceId: {
            kind: string;
            videoId: string;
        };
        videoOwnerChannelTitle: string;
        videoOwnerChannelId: string;
    };
};


export type PlaylistItems = {
    items: PlaylistItem[]
}

export default function Home() {
    const session = useSession();

    useEffect(() => {
        if (session.status === 'unauthenticated') {
            // If the user is not authenticated, force them to log in
            signIn();
        }
    }, [session]);


    const token = useMemo(() => {
        const accessToken = session.data?.user.accessToken;
        return accessToken;
    }, [session]);

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState<SnippetType | null>(null);
    const [playlist, setPlaylist] = useState<PlaylistItem[] | null>(null);

    const [videos, setVideos] = useState<VideoType[]>([]);
    // const [selectedVideo, setSelectedVideo] = useState<SnippetType | null>(null);
    // const [analytics, setAnalytics] = useState<AnalyticsType | null>(null);

    const [downloadApiUp, setDownloadApiUp] = useState(false);

    useEffect(() => {
        fetch('https://youtibee-api-v2.onrender.com/ping')
            .then(res => res.json())
            .then(() => setDownloadApiUp(true))
            .catch(err => console.error(err));
    }, [setDownloadApiUp]);

    useEffect(() => {
        if (token) {
            fetch('/api/liked', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(res => res.json())
                .then(data => setVideos(data))
                .catch(err => console.error(err));
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetch('/api/playlists', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(res => res.json())
                .then(data => setPlaylists(data))
                .catch(err => console.error(err));
        }
    }, [token]);


    // const fetchAnalytics = (videoId: string) => {
    //     if (token) {
    //         fetch(`/api/analytics/${videoId}`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         })
    //             .then(res => res.json())
    //             .then(data => setAnalytics(data));
    //     }
    // };


    const fetchPlaylist = (id: string) => {
        if (token) {
            fetch(`/api/playlists/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(res => res.json())
                .then(data => setPlaylist(data));
        }
    };

    return (
        <div className="container mx-auto p-4">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold mb-4 text-white"
            >
                Browse and download your youtube videos
            </motion.h1>

            <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-rows-3 grid-flow-col gap-1 overflow-x-auto pb-4"
            >
                {playlists.filter((playlist) => playlist.snippet.thumbnails.default).map(playlist => (
                    <motion.button
                        key={playlist.id}
                        className="cursor-pointer bg-gradient-to-b from-fuchsia-600 to-orange-400 text-white shadow-md rounded m-1 p-[2px] w-[220px] h-[76px] flex items-center gap-1.5 text-left hover:shadow-lg transition-shadow"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setSelectedPlaylist(playlist.snippet); fetchPlaylist(playlist.id); }}
                    >
                        <img
                            src={playlist.snippet.thumbnails.default.url}
                            alt={playlist.snippet.title}
                            className="w-[96x] h-[72px] rounded object-cover"
                        />
                        <p className="font-semibold text-sm flex-1 line-clamp-2 break-words h-[2.4em] leading-tight">{playlist.snippet.title}</p>
                    </motion.button>
                ))}
            </motion.ul>

            <AnimatePresence>
                {selectedPlaylist && playlist && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-8"
                    >
                        <motion.div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-4 text-white shadow-lg mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center gap-4">
                                {selectedPlaylist.thumbnails.default && <img
                                    src={selectedPlaylist.thumbnails.default.url}
                                    alt={selectedPlaylist.title}
                                    className="w-[120px] h-[90px]  rounded-lg object-cover shadow-md"
                                />}
                                <div>
                                    <h2 className="text-xl font-bold mb-1">{selectedPlaylist.title}</h2>
                                    <p className="text-sm opacity-90">{selectedPlaylist.channelTitle}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.ul
                            className="flex flex-wrap justify-center gap-5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {playlist.filter((video) => video.snippet.thumbnails.default).map((video, index) => (
                                <motion.li
                                    key={video.id}
                                    className="bg-gray-800/80 shadow-md rounded-lg p-1 flex items-center gap-2 w-[360px]"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                // whileHover={{ scale: 1.01 }}
                                >
                                    <img
                                        src={video.snippet.thumbnails.default.url}
                                        alt={video.snippet.title}
                                        className="w-[120px] h-[90px] rounded object-cover"
                                    />
                                    <div className="flex-1 h-[90px] flex flex-col justify-around">
                                        <p className="font-medium text-sm text-gray-100 mb-1 line-clamp-2 break-words h-[2.4em] leading-tight">{video.snippet.title}</p>
                                        <div className="flex gap-1.5">
                                            <motion.button
                                                onClick={() => window.open(`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`, '_blank')}
                                                className="cursor-pointer bg-red-500 text-sm text-white font-medium px-2.5 py-1.5 rounded hover:bg-red-600 flex items-center gap-1"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                                </svg>
                                                Watch
                                            </motion.button>
                                            <DownloadButton
                                                videoId={`${video.snippet.resourceId.videoId}`}
                                                videoTitle={video.snippet.title}
                                                disabled={!downloadApiUp}
                                            />
                                        </div>
                                    </div>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* <AnimatePresence>
                {selectedVideo && analytics && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-8 bg-gray-100 p-4 rounded-lg shadow-md"
                    >
                        <h2 className="text-xl font-bold mb-4">Analytics for Video: {selectedVideo.title}</h2>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <p className="text-gray-700">Views: {analytics.viewCount}</p>
                            <p className="text-gray-700">Likes: {analytics.likeCount}</p>
                            <p className="text-gray-700">Comments: {analytics.commentCount}</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence> */}
        </div>
    );
}