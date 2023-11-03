export interface Playlist {
    _id?: string;
    name: string;
    description: string;
    thumbnail: string;
    link?: string;
    videos: Video[];
}

export interface Video {
    _id?: string;
    title: string;
    url: string;
    thumbnail: string;
    status?: "watched" | "isWatching" | "toWatch";
    date?: Date;
    watchedBy?: string[];
}

export interface ScraperResponseVideo {
    url: string;
    info: {
        title: string;
        description: string;
        thumbnail_url: string;
    }
}

export interface StatsResponse {
    success: boolean;
    data: Video[];
}