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

const setTodaysVideo = async (req: Request, res: Response, next: NextFunction) => {
    const video_id = req.params.video_id;
    try {
       const video =  _setTodaysVideo(video_id);

        res.status(StatusCodes.OK).json(new SuccessfulApiResponse(true, video));

    } catch (error: any) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new UnSuccessfulApiResponse(false, `Server failed to process this request: ${error?.message}`));
    }
}

const _setTodaysVideo = async (video_id: string) => {
    try {
        const video = await VideoModel.findById(video_id);
        if (!video) {
            throw new Error(`Video with id ${video_id} was not found`);
        }

        video.date = new Date();
        await video.save();

        return video;

    } catch (error: any) {
        throw new Error(`Error occured: ${error.message}`);
    }
}

const getVideosForDate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestedDate = req.params.date;
        const date = new Date(requestedDate);

        if (isNaN(date.getTime())) {
            return res.status(StatusCodes.BAD_REQUEST).json(new UnSuccessfulApiResponse(false, 'Invalid date format'));
        }

        // Calculate the start and end of the requested date
        const startDate = new Date(date); // start
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999); //end

        const videos = await VideoModel.find({
            date: {
                $gte: startDate,
                $lte: endDate,
            }
        });

        res.status(StatusCodes.OK).json(new SuccessfulApiResponse(true, videos));
    } catch (error: any) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new UnSuccessfulApiResponse(false, `Server failed to process this request: ${error?.message}`));
    }
}



export { saveVideos , saveVideoWatchers, videoStatistics, setTodaysVideo, getVideosForDate }