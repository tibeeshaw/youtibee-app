'use client'
import useAuth from "@/hooks/useAuth";
import { useState, useEffect } from "react";

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
    const user = useAuth();

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState<SnippetType | null>(null);
    const [playlist, setPlaylist] = useState<PlaylistItems | null>(null);

    const [videos, setVideos] = useState<VideoType[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<SnippetType | null>(null);
    const [analytics, setAnalytics] = useState<AnalyticsType | null>(null);

    useEffect(() => {
        if (user) {
            fetch('/api/liked-videos')
                .then(res => res.json())
                .then(data => setVideos(data));
        }
    }, [user]);

    const fetchAnalytics = (videoId: string) => {
        if (user) {
            fetch(`/api/analytics/${videoId}`)
                .then(res => res.json())
                .then(data => setAnalytics(data));
        }
    };


    const fetchPlaylist = (id: string) => {
        if (user) {
            fetch(`/api/playlists/${id}`)
                .then(res => res.json())
                .then(data => setPlaylist(data));
        }
    };

    useEffect(() => {
        if (user) {
            fetch('/api/playlists')
                .then(res => res.json())
                .then(data => setPlaylists(data))
                .catch(err => console.error(err));
        }
    }, [user]);

    return (
        <div>
            <h1>YouTube Music Video Analytics</h1>
            <ul>
                {videos.map(video => (
                    <li key={video.id}>
                        <p>{video.snippet.title}</p>
                        <button onClick={() => { setSelectedVideo(video.snippet); fetchAnalytics(video.id); }}>
                            View Analytics
                        </button>
                    </li>
                ))}
            </ul>

            <div className="my-4"></div>

            <ul>
                {playlists.map(playlist => (
                    <li key={playlist.id}>
                        <p>{playlist.snippet.title}</p>
                        <button onClick={() => { setSelectedPlaylist(playlist.snippet); fetchPlaylist(playlist.id); }}>
                            View Playlist
                        </button>
                    </li>
                ))}
            </ul>
            {selectedPlaylist && playlist && (
                <div>
                    <h2>playlist selected: {selectedPlaylist.title}</h2>

                    <ul>
                        {playlist.items.map(video => (
                            <li key={video.id}>
                                <p>{video.snippet.title}</p>
                                <button onClick={() => { setSelectedVideo(video.snippet); fetchAnalytics(video.snippet.resourceId.videoId); }}>
                                    View Analytics
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="my-4"></div>

            {selectedVideo && analytics && (
                <div>
                    <h2>Analytics for Video ID: {selectedVideo.title}</h2>
                    <p>Views: {analytics.viewCount}</p>
                    <p>Likes: {analytics.likeCount}</p>
                    <p>Comments: {analytics.commentCount}</p>
                </div>
            )}

        </div>

    );
}