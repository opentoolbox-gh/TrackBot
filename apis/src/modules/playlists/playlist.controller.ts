import { Request, Response, NextFunction } from "express";
import PlaylistModel from "./playlist.model"
import { StatusCodes } from "http-status-codes";
import { SuccessfulApiResponse, UnSuccessfulApiResponse } from "../../helper/ApiResponse.helper";
import Playlist from "../../interfaces/playlist.interface";
import { saveVideos } from "../videos/videos.controller";
import VideoModel from "../videos/video.model";
import { playlistCreateSchema } from "./playlist.schema";
import createHttpError from "http-errors";

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
            return res.status(StatusCodes.OK).json(new UnSuccessfulApiResponse(false, `Playlist with id ${playlist_id} was not found`));
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
            return res.status(StatusCodes.OK).json(new UnSuccessfulApiResponse(false, `Playlist with id ${playlist_id} was not found`));
        }

        const videos_ids = playlist.videos.map(video => {
            return String(video);
        })

        await VideoModel.deleteMany({ _id : { $in : videos_ids }});
        await PlaylistModel.deleteOne({ _id: playlist_id });

        return res.status(StatusCodes.OK).json(new SuccessfulApiResponse(true, {message: `Playlist with id ${playlist_id} was deleted`}));
    } catch (error: any) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new UnSuccessfulApiResponse(false, `Server Failed to process this request: ${error?.message}`))
    }
}

export default {
    createPlaylist,
    getAllPlaylists,
    getPlaylistById,
    deletePlaylist
}