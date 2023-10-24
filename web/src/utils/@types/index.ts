export interface Playlist {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    link: string;
    videos: Video[];
}

export interface Video {
    title: string;
    link: string;
    thumbnail: string;
    status: "watched" | "watching" | "toWatch";
}