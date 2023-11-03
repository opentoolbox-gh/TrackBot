import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import VideoModel from "../videos/video.model";
import axios from "axios";
import handlers from "./slack.handlers";
import Video from "../../interfaces/video.interface";

const handleSlackRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(StatusCodes.OK).json({ message: "OK" });
  } catch (error: any) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

const handleDoneCommand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(StatusCodes.OK).send({
      response_type: "ephimeral",
      text: "Processing your request... Please wait!",
    });
    console.log(req.body);
    const videosBeingWatched = await VideoModel.find({
      // status: "isWatching",
      date: new Date().setHours(0, 0, 0, 0),
      watchedBy: { $nin: [req.body.user_id] }
    }).exec();
    console.log(videosBeingWatched);
    if(videosBeingWatched.length) {
      await axios.post(req.body.response_url, {
        response_type: "ephimeral",
        replace_original: true,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Which video(s) did you finish watching?*",
            },
            accessory: {
              type: "checkboxes",
              action_id: "video_selection",
              options: [
                ...videosBeingWatched.map((video) => ({
                  value: video._id,
                  text: {
                    type: "plain_text",
                    text: video.title,
                  },
                })),
              ],
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "SAVE",
                  emoji: true,
                },
                style: "primary",
                value: "video_selection_submit",
                action_id: "video_selection_submit_btn",
                confirm: {
                  title: {
                    type: "plain_text",
                    text: "Are you sure?",
                  },
                  text: {
                    type: "mrkdwn",
                    text: "Note that this action is irreversible.\nAre you sure you want to do this?",
                  },
                  confirm: {
                    type: "plain_text",
                    text: "Submit",
                  },
                  deny: {
                    type: "plain_text",
                    text: "Cancel",
                  },
                },
              },
            ],
          },
        ],
      });
    } else {
      await axios.post(req.body.response_url, {
        response_type: "ephimeral",
        replace_original: true,
        text: `<@${req.body.user_id}> There are no videos to mark as watched. \nYou've either already marked them as watched or there are no videos being watched at the moment.`
      });
    }
  } catch (error: any) {
    console.log(error);
    // res
    //   .status(StatusCodes.INTERNAL_SERVER_ERROR)
    //   .json({ message: "Internal Server Error" });
  }
};

const handleProgressCommand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(StatusCodes.OK).send({
    response_type: "ephimeral",
    text: "Processing your request... Please wait!",
  });
  try {
    const { user_id } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const videos = await VideoModel.find<Video>({
      date: today,
      // watchedBy: { $in: [user_id] }
    }).exec();
    const progress: {watched: Video[], not_watched: Video[]} = {
      watched: [],
      not_watched: [],
    }
    for(let video of videos) {
      if(video.watchedBy?.includes(user_id)) {
        progress.watched.push(video);
      } else {
        progress.not_watched.push(video);
      }
    }
    handlers.send_progress(req.body.channel_id, req.body.user_id, progress);
  } catch (e: any) {
    console.log(e.message);
  }
};

const handleInteraction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(StatusCodes.OK).send({
      response_type: "ephimeral",
      text: "OK",
    });
    console.log(JSON.stringify(JSON.parse(req.body.payload), null, 4));
    const payload = JSON.parse(req.body.payload);
    if (payload.type === "block_actions") {
      for (const action of payload.actions) {
        if (Object.keys(handlers).includes(action.action_id)) {
          await handlers[action.action_id as string](payload, action);
        }
      }
    }
  } catch (error: any) {
    console.log(error);
    // res
    //   .status(StatusCodes.INTERNAL_SERVER_ERROR)
    //   .json({ message: "Internal Server Error" });
  }
};

export default {
  handleSlackRequest,
  handleDoneCommand,
  handleProgressCommand,
  handleInteraction,
};
