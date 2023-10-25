import mongoose, { Schema, model } from "mongoose";

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 100,
        minLength: 2
    },
    thumbnail: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videos: {
        type: [mongoose.Types.ObjectId],
        ref: 'Video'
    }
});

const PlaylistModel = model('Playlist', playlistSchema);

export default PlaylistModel;