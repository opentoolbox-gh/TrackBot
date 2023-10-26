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
    })
    .catch((error) => {
        next(createHttpError(new UnSuccessfulApiResponse(false, error.message)));
    });
};

export {saveVideos}