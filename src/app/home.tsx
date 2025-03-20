'use client'
import DownloadButton from "@/components/DownloadButton";
import { signIn, useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircleIcon, CodeIcon, InfoIcon, RefreshCwIcon, StarIcon } from "lucide-react";
import classnames from 'classnames';

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

export type RateLimit = {
    email: string;
    requests_used: number;
    requests_remaining: number;
    limit: number;
    window_seconds: number;
};

export type PlaylistItems = {
    items: PlaylistItem[]
}

export default function Home() {
    const session = useSession();

    // useEffect(() => {
    //     if (session.status === 'unauthenticated') {
    //         // If the user is not authenticated, force them to log in
    //         signIn();
    //     }
    // }, [session]);


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
    const [fetchingRate, setFetchingRate] = useState(false);
    
    const [rate, setRate] = useState<RateLimit | null>(null);

    useEffect(() => {
        fetch('/api/download')
            .then(res => res.json())
            .then(() => setDownloadApiUp(true))
            .catch(err => console.error(err));
    }, [setDownloadApiUp]);

    const fetchRate = useCallback(async () => {
        if(token){
            await fetch('/api/download/rate', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(res => res.json())
            .then((data) => setRate(data))
            .catch(err => console.error(err));
        }
    }, [setRate, token]);

    useEffect(() => {
        fetchRate();
    }, [fetchRate]);

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

    const onDownload = async () => {
        setFetchingRate(true);
        setTimeout(async () => {
            await fetchRate();
            setFetchingRate(false);
        }, 1000);
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex-grow container mx-auto my-4">
                <motion.section
                    className="bg-gray-800/80 text-white break-words sm:p-6 p-2 rounded-lg shadow-lg"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl font-semibold mb-4 flex items-center gap-2"
                    >
                        Welcome to <span className="text-blue-300">YouTibee</span>!
                    </motion.h1>
                    <motion.h2
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="sm:text-xl font-semibold mb-4 flex items-center gap-2"
                    >
                        <InfoIcon className="w-6 h-6 text-blue-400" />
                        Browse and download your youtube videos
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-gray-300 mb-4"
                    >
                        This site showcases an application I developed. It is a technical demonstration that allows you to download YouTube videos as audio files for personal use only. This project is not intended for public distribution or commercialization. My main goal is to demonstrate my skills in web development and API integration, particularly with the YouTube API, as well as my ability to create useful tools.
                    </motion.p>

                    <motion.h3
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-2xl font-semibold mb-2 flex items-center gap-2"
                    >
                        <StarIcon className="w-5 h-5 text-yellow-400" />
                        Important to know
                    </motion.h3>
                    <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="list-disc pl-6 space-y-2 text-gray-300"
                    >
                        <li>
                            <strong className="text-red-400">For personal use only:</strong> This application is intended solely for personal use. It does not align with YouTube’s intention of allowing direct content downloads outside of the features offered by the platform (such as YouTube Premium). This application is a personal development project, and its public use would violate YouTube's terms of service.
                        </li>
                        <li>
                            <strong className="text-green-400">Respect for copyright:</strong> The content downloaded through this application may be copyrighted. I want to emphasize that this project is not intended to infringe upon the rights of content creators. If you choose to use this tool, it is your responsibility to comply with copyright laws and the terms of service regarding the use of videos and audio.
                        </li>
                        <li>
                            <strong className="text-blue-400">OAuth2 Screen and Security:</strong> When using the application, you'll be prompted to go through an OAuth2 screen to log in with your Google account and grant access to some of your data. The application uses the following scopes: <code>openid</code>, <code>email</code>, <code>profile</code>, and <code>https://www.googleapis.com/auth/youtube.readonly</code>. These scopes allow access to basic profile information and YouTube videos, but do not request sensitive data (such as search history or financial information).
                        </li>
                    </motion.ul>

                    <motion.h3
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                        className="text-2xl font-semibold mb-2 mt-4 flex items-center gap-2"
                    >
                        <AlertCircleIcon className="w-5 h-5 text-purple-400" />
                        Why this warning is important
                    </motion.h3>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3 }}
                        className="text-gray-300"
                    >
                        The lack of Google validation means that the app has not been audited for security and privacy compliance according to Google’s standards for public applications. As a user, it's important to understand this risk before proceeding with any login. If you have any concerns, I recommend using a secondary account or one dedicated to this purpose.
                    </motion.p>

                    <motion.h3
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                        className="text-2xl font-semibold mb-2 mt-4 flex items-center gap-2"
                    >
                        <CodeIcon className="w-5 h-5 text-teal-400" />
                        Technical Stack
                    </motion.h3>
                    <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.7 }}
                        className="list-disc pl-6 space-y-2 text-gray-300"
                    >
                        <li>
                            <strong className="text-indigo-400">Web application on Vercel:</strong> The frontend application is coded with <code>Next.js</code>. It uses the YouTube API to fetch user playlists and liked videos.
                        </li>
                        <li>
                            <strong className="text-pink-400">Download API on Render:</strong> The backend application is coded with <code>Python</code> and packaged with <code>Docker</code>. It uses <code>yt-dlp</code> for downloading YouTube videos and <code>Redis</code> for rate limiting.
                        </li>
                    </motion.ul>
                </motion.section>
            </div>

            <motion.hr
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                className="my-8 border-t border-gray-700"
            />

            {session.status === 'authenticated' ? 
            <>
            {rate && (
                <>
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    // transition={{ delay: 1.2 }}
                    className="bg-gray-800/80 text-white p-4 rounded-lg shadow-md mb-4"
                >
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <InfoIcon className="w-5 h-5 text-blue-400" />
                        Rate Limit Information
                        <motion.button
                        onClick={async () => {        setFetchingRate(true);
                            await fetchRate();         setFetchingRate(false);
                        }}
                        disabled={fetchingRate}
                        className={classnames(
                            "cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium px-2 py-1 rounded flex items-center gap-1",
                            { "opacity-50 !cursor-not-allowed": fetchingRate }
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <RefreshCwIcon className="w-5 h-5 text-white" />
                        </motion.button>
                    </h3>
                    <div className="space-y-2">
                        <p className="text-sm flex items-center gap-2">
                            <StarIcon className="w-4 h-4 text-yellow-400" />
                            <strong>Requests Used:</strong> <span className="text-yellow-300">{rate.requests_used}</span> / {rate.limit}
                        </p>
                        <p 
                         className={classnames("text-sm flex items-center gap-2")}>
                            <AlertCircleIcon className={classnames("w-4 h-4", 
                                 rate.requests_remaining === 0 
                                 ? "text-red-300" 
                                 : rate.requests_remaining === 1 
                                 ? "text-orange-300" 
                                 : "text-green-300"
                            )} />
                            <strong>Requests Remaining:</strong> 
                            <span 
                               className={
                                classnames( 
                                    rate.requests_remaining === 0 
                                        ? "text-red-300" 
                                        : rate.requests_remaining === 1 
                                        ? "text-orange-300" 
                                        : "text-green-300"
                    )
                               }
                            >
                                {rate.requests_remaining}
                            </span>
                        </p>
                        <p className="text-sm flex items-center gap-2">
                            <CodeIcon className="w-4 h-4 text-purple-400" />
                            <strong>Rate Limit Window:</strong> <span className="text-purple-300">{rate.window_seconds} seconds</span>
                        </p>
                    </div>
                </motion.div>
                
            <motion.hr
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            // transition={{ delay: 1.5 }}
            className="my-8 border-t border-gray-700"
        />
        </>
            )}

            <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                // transition={{ delay: 2 }}
                className="grid grid-rows-3 grid-flow-col gap-1 overflow-x-auto pb-4"
            >
                {playlists.filter((playlist) => playlist.snippet.thumbnails.default).map((playlist, index) => (
                    <li key={playlist.id}>
                    <motion.button
                        className="cursor-pointer bg-gradient-to-b from-fuchsia-600 to-orange-400 text-white shadow-md rounded m-1 p-[2px] w-[220px] h-[76px] flex items-center gap-1.5 text-left hover:shadow-lg transition-shadow"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setSelectedPlaylist(playlist.snippet); fetchPlaylist(playlist.id); }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <img
                            src={playlist.snippet.thumbnails.default.url}
                            alt={playlist.snippet.title}
                            className="w-[96x] h-[72px] rounded object-cover"
                        />
                        <p className="font-semibold text-sm flex-1 line-clamp-2 break-words h-[2.4em] leading-tight">{playlist.snippet.title}</p>
                    </motion.button>
                    </li>
                ))}
            </motion.ul>

            <AnimatePresence>
                {selectedPlaylist && playlist && (
                    <>
                    
            <motion.hr
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                className="my-8 border-t border-gray-700"
            />
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
                                                disabled={!(downloadApiUp && rate && rate.requests_remaining > 0) || fetchingRate}
                                                onClick={() => onDownload()}
                                            />
                                        </div>
                                    </div>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </motion.div>
                    </>
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
            </>: 
            (session.status === 'loading' ? <>
            <div className="flex justify-center items-center h-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    // transition={{ duration: 0.5 }}
                    className="flex flex-col items-center"
                >
                    <svg
                        className="animate-spin h-8 w-8 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                    </svg>
                </motion.div>
            </div>
            </> : 
            <div className="flex justify-center items-center h-full">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-800/80 text-white p-6 rounded-lg shadow-lg text-center"
                >
                    <h2 className="text-2xl font-semibold mb-4">Welcome to YouTibee</h2>
                    <p className="text-gray-300 mb-4">
                        Please sign in to access your playlists and liked videos.
                    </p>
                    <motion.button
                        onClick={() => signIn()}
                        className="bg-blue-500 text-white font-medium px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Sign In
                    </motion.button>
                </motion.div>
            </div>
            )
            }
        </div>
    );
}