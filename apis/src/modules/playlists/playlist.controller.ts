import { Request, Response, NextFunction } from "express";
import PlaylistModel from "./playlist.model"
import { StatusCodes } from "http-status-codes";
import { SuccessfulApiResponse, UnSuccessfulApiResponse } from "../../helper/ApiResponse.helper";
import Playlist from "../../interfaces/playlist.interface";
import { saveVideos } from "../videos/videos.controller";
import VideoModel from "../videos/video.model";
import { playlistCreateSchema, playlistUpdateSchema } from "./playlist.schema";
import { Types } from "mongoose";
import { videoSchema } from "../videos/video.schema";

const getAllPlaylists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const playlists = await PlaylistModel.find({}).populate('videos');
        return res.status(StatusCodes.OK).json(new SuccessfulApiResponse(true, playlists));
    } catch (error: any) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new UnSuccessfulApiResponse(false, `Server Failed to process this request: ${error?.message}`))
    }
}

const createPlaylist = async (req: Request, res: Response, next: NextFunction) => {

    try {

        let { name, thumbnail, description, videos } = await playlistCreateSchema.validateAsync(req.body);
    
        const videos_ids = await saveVideos(videos, next);

        const newPlaylist = await PlaylistModel.create({ name, thumbnail, description, videos: videos_ids });

        if (!newPlaylist) {
            return res.status(StatusCodes.BAD_REQUEST).json(new UnSuccessfulApiResponse(false, "Failed to save playlist"));
        }

        return res.status(StatusCodes.CREATED).json(new SuccessfulApiResponse(true, newPlaylist));
    } catch (error: any) {
        console.error(error);
        return res.status(StatusCodes.BAD_REQUEST).json(new UnSuccessfulApiResponse(false, `Unable to save playlist: ${error.message}`));
    }
}

const getPlaylistById = async (req: Request, res: Response, next: NextFunction) => {
    const playlist_id = req.params.playlist_id;
    try {
        const playlist = await PlaylistModel.findById(playlist_id);
        if ( !playlist ) {
            return res.status(StatusCodes.NOT_FOUND).json(new UnSuccessfulApiResponse(false, `Playlist with id ${playlist_id} was not found`));
        }

        return res.status(StatusCodes.OK).json(new SuccessfulApiResponse(true, playlist));
    } catch (error: any) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new UnSuccessfulApiResponse(false, `Server Failed to process this request: ${error?.message}`))
    }
}

const deletePlaylist = async (req: Request, res: Response, next: NextFunction) => {
    const playlist_id = req.params.playlist_id;
    try {
        const playlist = await PlaylistModel.findById(playlist_id);
        if ( !playlist ) {
            return res.status(StatusCodes.NOT_FOUND).json(new UnSuccessfulApiResponse(false, `Playlist with id ${playlist_id} was not found`));
        }

        const videos_ids = playlist.videos.map((video: Types.ObjectId) => {
            return String(video);
        });

        await VideoModel.deleteMany({ _id : { $in : videos_ids }});
        await PlaylistModel.deleteOne({ _id: playlist_id });

        return res.status(StatusCodes.OK).json(new SuccessfulApiResponse(true, {message: `Playlist with id ${playlist_id} was deleted`}));
    } catch (error: any) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new UnSuccessfulApiResponse(false, `Server Failed to process this request: ${error?.message}`))
    }
}

const removeVideoFromPlaylist = async (req: Request, res: Response, next: NextFunction) => {
    const playlist_id = req.params.playlist_id;
    const video_id = req.params.video_id;

    try {
        const playlist = await PlaylistModel.findOneAndUpdate(
            { _id: playlist_id },
            { $pull: { videos: video_id } },
            { new: true }
        );

        if (!playlist) {
            return res.status(StatusCodes.NOT_FOUND).json(new UnSuccessfulApiResponse(false, `Playlist with ID ${playlist_id} was not found`));
        }

        const deletedVideo = await VideoModel.deleteOne({ _id: video_id });

        if (deletedVideo.deletedCount === 0) {
            return res.status(StatusCodes.NOT_FOUND).json(new UnSuccessfulApiResponse(false, `Video with ID ${video_id} was not found`));
        }

        return res.status(StatusCodes.OK).json(new SuccessfulApiResponse(true, { message: `Video with ID ${video_id} was successfully removed from Playlist with ID ${playlist_id}` }));
    } catch (error: any) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new UnSuccessfulApiResponse(false, `Server failed to process this request: ${error.message}`));
    }
};



const addVideoToPlaylist = async (req: Request, res: Response, next: NextFunction) => {
    const playlist_id = req.params.playlist_id;

    try {
        const { url, thumbnail, title, status} = await videoSchema.validateAsync(req.body, {allowUnknown: false});
        const playlist = await PlaylistModel.findById(playlist_id);
        if (!playlist) {
            return res.status(StatusCodes.NOT_FOUND).json(new UnSuccessfulApiResponse(false, `Playlist with ID ${playlist_id} was not found`));
        }

        const newVideo = await VideoModel.create({ url, thumbnail, title, status});

        if (!newVideo) {
            return res.status(StatusCodes.BAD_REQUEST).json(new UnSuccessfulApiResponse(false, `There was an error while saving the video ...`));
        }

        playlist.videos.push(newVideo._id as Types.ObjectId);

        await playlist.save();

        return res.status(StatusCodes.OK).json(new SuccessfulApiResponse(true, { message: `Video with ID ${String(newVideo._id)} was successfully added to Playlist with ID ${playlist_id}` }));
    } catch (error: any) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new UnSuccessfulApiResponse(false, `Server failed to process this request: ${error.message}`));
    }
};


const updatePlaylistInfo = async (req: Request, res: Response, next: NextFunction) => {
    const playlist_id = req.params.playlist_id;
    try {
        const newValues = await playlistUpdateSchema.validateAsync(req.body, {allowUnknown: false});

        const playlist = await PlaylistModel.findById(playlist_id);

        if ( !playlist ) {
            return res.status(StatusCodes.NOT_FOUND).json(new UnSuccessfulApiResponse(false, `Playlist with id ${playlist_id} was not found`));
        }

        playlist.name = newValues.name || playlist.name;
        playlist.description = newValues.description || playlist.description;
        playlist.thumbnail = newValues.thumbnail || playlist.thumbnail;
        
        await playlist.save();

        res.status(StatusCodes.OK).json(new SuccessfulApiResponse(true, playlist));
    } catch (error: any) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new UnSuccessfulApiResponse(false, `Unable to update playlist: ${error.message}`));
    }
}

export default {
    createPlaylist,
    getAllPlaylists,
    getPlaylistById,
    deletePlaylist,
    removeVideoFromPlaylist,
    addVideoToPlaylist,
    updatePlaylistInfo
}