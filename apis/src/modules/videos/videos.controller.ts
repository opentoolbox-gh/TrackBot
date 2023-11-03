import Video from "../../interfaces/video.interface";
import VideoModel from "./video.model";
import createHttpError from "http-errors";
import {
  SuccessfulApiResponse,
  UnSuccessfulApiResponse,
} from "../../helper/ApiResponse.helper";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { slackClient } from "../slack/slack.routes";
import { channel } from "../../helper/constants";
import { shallowCopy } from "../../helper";

const saveVideos = async (videosData: Video[], next: NextFunction) => {
  return new Promise(async (resolve, reject) => {
    try {
      const videoIds: string[] = await Promise.all(
        videosData.map(async (current_video: Video) => {
          const video = await VideoModel.create(current_video);
          if (!video) {
            const error = new Error("Failed to handle request");
            reject(error);
          }
          return String(video._id);
        })
      );
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
};

const videoStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = req.params.user_id;
    console.log(user_id);
    const videosWatched = await VideoModel.find({
      watchedBy: user_id,
    });
    res
      .status(StatusCodes.OK)
      .json(new SuccessfulApiResponse(true, videosWatched));
  } catch (error: any) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new UnSuccessfulApiResponse(
          false,
          `Server Failed to process this request: ${error?.message}`
        )
      );
  }
};

const setTodaysVideo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const video_id = req.params.video_id;
  const videos = req.body.videos ?? [];

  try {
    if (!video_id && !videos.length) throw new Error("Invalid request");
    if (video_id) videos.push({ video_id, setAsToday: true });
    const videosBefore = await VideoModel.find({
      date: new Date().setHours(0, 0, 0, 0),
    });
    const _videos = await Promise.all(
      videos.map(async (video: { video_id: string; setAsToday: boolean }) => {
        return await _setTodaysVideo(video.video_id, video.setAsToday);
      })
    );

    const todaysVideos = await VideoModel.find({
      date: new Date().setHours(0, 0, 0, 0),
    });

    const channels = await (new Promise(async (resolve) => {
      const arr = [];
      let next_cursor: string | undefined = undefined;
      while (true) {
        const c: any = await slackClient.conversations.list({
          types: "public_channel,private_channel,mpim,im",
          ...(Boolean(next_cursor) && { cursor: next_cursor }),
        });

        arr.push(...c.channels);
        if (!c.response_metadata?.next_cursor) {
          resolve({ channels: arr });
          break;
        }
        next_cursor = c.response_metadata.next_cursor;
        console.log("fetching more channels...", next_cursor);
      }
    }) as any);
    const channelId = channels.channels.find(
      (c: { name: string }) => c.name === channel
    )?.id;

    console.log({todaysVideos})

    if (channelId) {
      slackClient.chat.postMessage({
        channel: channelId,
        text: todaysVideos.length ? `Hello <!channel>, here's${videosBefore.length ? ' an updated list of ': ' '}today's videos to watch :\n\n${todaysVideos
            .map((video) => `- <${video.url}|${video.title}>\n`)
            .join("")}` : `${videosBefore.length ? 'Actually <!channel>, ' : '<!channel> '}There are no videos to watch today.`
      });
    }
    res.status(StatusCodes.OK).json(new SuccessfulApiResponse(true, _videos));
  } catch (error: any) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new UnSuccessfulApiResponse(
          false,
          `Server failed to process this request: ${error?.message}`
        )
      );
  }
};

const _setTodaysVideo = async (
  video_id: string,
  setAsToday: boolean = true
) => {
  try {
    const video = await VideoModel.findById(video_id);
    if (!video) {
      throw new Error(`Video with id ${video_id} was not found`);
    }

    video.date = setAsToday ? new Date(new Date().setHours(0,0,0,0)) : undefined;
    await video.save();

    return video;
  } catch (error: any) {
    throw new Error(`Error occured: ${error.message}`);
  }
};

const users: {
  users: {
    id: string;
    profile: { real_name: string };
  }[];
  lastUpdated: Date;
} = {
  users: [],
  lastUpdated: new Date(),
};

const findUsers = async () => {
  const _users: any = await(
    new Promise(async (resolve) => {
      let next_cursor: string | undefined = undefined;
      const arr = [];
      while (true) {
        const c: any = await slackClient.users.list({
          ...(Boolean(next_cursor) && { cursor: next_cursor }),
          limit: 30,
        });

        arr.push(...c.members);
        if (!c.response_metadata?.next_cursor) {
          resolve({ members: arr });
          break;
        }
        next_cursor = c.response_metadata.next_cursor;
        console.log("fetching more users...", next_cursor);
      }
    })
  );
  users.users = _users.members;
  users.lastUpdated = new Date();
}

findUsers();

const getVideosForDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestedDate = req.params.date;
    const date = new Date(requestedDate);

    if (isNaN(date.getTime())) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(new UnSuccessfulApiResponse(false, "Invalid date format"));
    }

    // Calculate the start and end of the requested date
    const startDate = new Date(date); // start
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999); //end

    let videos = await VideoModel.find<Video>({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).exec();

    if(!users.users.length || (new Date().getTime() - users.lastUpdated.getTime()) > 24 * 60 * 60 * 1000) {
      // const usersList = await slackClient.users.list({limit: 400});
      await findUsers();
    }

    videos = videos.map(shallowCopy).map((video: Video) => {
      const watchedBy: string[] = video.watchedBy?.map((userId) => {
        const user = users.users.find((u) => u.id === userId);
        return user?.profile?.real_name || userId;
      }) ?? [];
      return {
        ...video,
        watchedBy,
      };
    });

    res.status(StatusCodes.OK).json(new SuccessfulApiResponse(true, videos));
  } catch (error: any) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new UnSuccessfulApiResponse(
          false,
          `Server failed to process this request: ${error?.message}`
        )
      );
  }
};

export {
  saveVideos,
  saveVideoWatchers,
  videoStatistics,
  setTodaysVideo,
  getVideosForDate,
};
