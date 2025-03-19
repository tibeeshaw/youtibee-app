'use client'
import DownloadButton from "@/components/DownloadButton";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

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
    const [selectedVideo, setSelectedVideo] = useState<SnippetType | null>(null);
    const [analytics, setAnalytics] = useState<AnalyticsType | null>(null);

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

    
    const fetchAnalytics = (videoId: string) => {
        if (token) {
            fetch(`/api/analytics/${videoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(res => res.json())
                .then(data => setAnalytics(data));
        }
    };


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
            <h1 className="text-2xl font-bold mb-4">YouTube Music Video Analytics</h1>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map(playlist => (
                <li key={playlist.id} className="bg-white shadow-md rounded-lg p-4">
                <p className="font-semibold text-lg">{playlist.snippet.title}</p>
                <button 
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => { setSelectedPlaylist(playlist.snippet); fetchPlaylist(playlist.id); }}
                >
                    View Playlist
                </button>
                </li>
            ))}
            </ul>

            {selectedPlaylist && playlist && (
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Playlist Selected: {selectedPlaylist.title}</h2>

                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {playlist.map(video => (
                    <li key={video.id} className="bg-white shadow-md rounded-lg p-4">
                    <p className="font-semibold text-lg">{video.snippet.title}</p>
                    <button 
                        className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        onClick={() => { setSelectedVideo(video.snippet); fetchAnalytics(video.snippet.resourceId.videoId); }}
                    >
                        View Analytics
                    </button>
                    <DownloadButton 
                        videoId={`${video.snippet.resourceId.videoId}`} 
                        videoTitle={video.snippet.title} 
                        disabled={!downloadApiUp} 
                    />
                    </li>
                ))}
                </ul>
            </div>
            )}

            {selectedVideo && analytics && (
            <div className="mt-8 bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Analytics for Video: {selectedVideo.title}</h2>
                <p className="text-gray-700">Views: {analytics.viewCount}</p>
                <p className="text-gray-700">Likes: {analytics.likeCount}</p>
                <p className="text-gray-700">Comments: {analytics.commentCount}</p>
            </div>
            )}
        </div>

    );
}