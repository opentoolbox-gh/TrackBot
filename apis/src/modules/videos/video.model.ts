import { Schema, model } from "mongoose";
import { registerSchema } from "swaggiffy";


const videoSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        requried: true,
        maxLength: 100,
        minLength: 2
    },
    status: {
        type: String,
        enum: ["watched", "isWatching", "toWatch"],
        default: "toWatch"
    }
});

const VideoModel = model("Video", videoSchema);

export default VideoModel

registerSchema('Video', videoSchema, { orm: 'mongoose' });