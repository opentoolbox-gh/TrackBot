import Video from "./video.interface";

export default interface Playlist {
    name: String,
    thumbnail: String, 
    description: String, 
    videos: Video[]
}