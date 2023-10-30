import Video from "../../interfaces/video.interface";
import VideoModel from "./video.model";
import createHttpError from "http-errors";
import { SuccessfulApiResponse, UnSuccessfulApiResponse } from "../../helper/ApiResponse.helper";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const saveVideos = async (videosData: Video[], next: NextFunction) => {
    return new Promise(async (resolve, reject) => {
        try {
            const videoIds: string[] = await Promise.all(videosData.map(async (current_video: Video) => {
                const video = await VideoModel.create(current_video);
                if (!video) {
                    const error = new Error("Failed to handle request");
                    reject(error);
                }
                return String(video._id);
            }));
            resolve(videoIds);
        } catch (error) {
            reject(error);
        }
    });
};

const saveVideoWatchers = async (userId: string, videoId: string) => {
    try {
        const video = await VideoModel.findById(videoId);
        if (!video) {
            throw new Error(`Video with id ${videoId} was not found`);
        }

        video.watchedBy?.push(userId);

        await video.save();

        return video;
    } catch (error: any) {
        throw new Error(`Error occured: ${error.message}`);
    }
}

const videoStatistics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id = req.params.user_id;
        console.log(user_id)
        const videosWatched = await VideoModel.find({
            watchedBy: user_id
        });
        res.status(StatusCodes.OK).json(new SuccessfulApiResponse(true, videosWatched));
    } catch (error: any) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new UnSuccessfulApiResponse(false, `Server Failed to process this request: ${error?.message}`))
    }
}

export { saveVideos , saveVideoWatchers, videoStatistics }