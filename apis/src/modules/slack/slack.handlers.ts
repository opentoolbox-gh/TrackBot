import axios from "axios";
import { slackClient } from "./slack.routes";

const video_selection_submit_btn = async (payload: any, action: any) => {
  await axios.post(payload?.response_url, {
    response_type: "ephimeral",
    text: "",
    replace_original: true,
    delete_original: true,
  });
  const _ = Object.keys(payload?.state?.values)[0];
  const selectedVideos = payload?.state?.values[
    _
  ].video_selection.selected_options.map((option: any) => ({
    value: option.value,
    text: option.text.text,
  }));
  await slackClient.client.chat.postMessage({
    channel: payload?.channel?.id,
    text: `<!channel> <@${
      payload?.user?.id
    }> has finished watching: \n${selectedVideos
      ?.map((video: any) => `- ${video.text}`)
      .join("\n")}`,
  });
  // Add the user to watchedBy of the video
};

type ToExport = { [key: string]: Function };

const toExport: ToExport = {
  video_selection_submit_btn,
};

export default toExport;
