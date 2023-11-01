import axios from "axios";
import { slackClient } from "./slack.routes";
import { saveVideoWatchers } from "../videos/videos.controller";
import Video from "../../interfaces/video.interface";

const video_selection_submit_btn = async (payload: any, action: any) => {
  await axios.post(payload?.response_url, {
    response_type: "ephimeral",
    text: "Congratulations :tada:",
    replace_original: true,
    // delete_original: true,
  });
  const _ = Object.keys(payload?.state?.values)[0];
  const selectedVideos = payload?.state?.values[
    _
  ].video_selection.selected_options.map((option: any) => ({
    value: option.value,
    text: option.text.text,
  }));
  for(let vid of selectedVideos) {
    await saveVideoWatchers(payload?.user?.id, vid.value)
  }
};

const send_progress = async (channel_id: string, user_id: string, progress: {watched: Video[], not_watched: Video[]}) => {
  try {
    const progress_watched_formatted = !progress.watched.length ? 'None' : progress.watched.map((video) => (`- ${video.title}`)).join('\n');
    const progress_not_watched_formatted = !progress.not_watched.length ? 'None' : progress.not_watched.map((video) => (`- ${video.title}`)).join('\n');
    const result = await slackClient.chat.postEphemeral({
      channel: channel_id,
      user: user_id,
      text: `*Progress*\n\n*Watched*\n${progress_watched_formatted}\n\n*Not Watched*\n${progress_not_watched_formatted}`,
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

type ToExport = { [key: string]: Function };

const toExport: ToExport = {
  video_selection_submit_btn,
  send_progress
};

export default toExport;
