import Video from "../../interfaces/video.interface";
import VideoModel from "./video.model";
import createHttpError from "http-errors";
import { UnSuccessfulApiResponse } from "../../helper/ApiResponse.helper";
import { NextFunction } from "express";

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

export { saveVideos , saveVideoWatchers }