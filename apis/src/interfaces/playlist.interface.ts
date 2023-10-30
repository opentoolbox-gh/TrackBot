import Video from "./video.interface";
import mongoose from "mongoose";

export default interface Playlist {
    name: String,
    thumbnail: String, 
    description: String, 
    videos: Video[]
}

export interface PlaylistMongooseSchema {
    name: String,
    thumbnail: String, 
    description: String, 
    videos: mongoose.Types.ObjectId[] 
}