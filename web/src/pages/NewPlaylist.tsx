import axios from "axios";
import React, { AnchorHTMLAttributes } from "react";
import { ScraperResponse, Video } from "../utils/@types";
import VideoCard from "../components/VideoCard";

const NewPlaylist = () => {
  const [playlistUrl, setPlaylistUrl] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [videos, setVideos] = React.useState<Video[]>([]);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.get<ScraperResponse>(
        `https://10downloader.com/playlist?v=${playlistUrl}`
        );

      if (!data.is_playlist) return;

      const res = document.createElement("div");
      res.innerHTML = data.html;
      setVideos(
        Array.from(res.querySelectorAll("table > tbody > tr")).map(
          (el: Element): Video => ({
            thumbnail: el.querySelector("img")!.src,
            link:
              el
                .querySelector("a.btn_download")!
                .href!.match(/\/download\?v=(.*)/)[1] ?? "",
            title:
              el.querySelector(".playlist__video--title")!.textContent ?? "",
          })
        )
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mid-center px-4 py-2">
      <h1 className="text-3xl dark:text-white font-bold">
        Create a new playlist from youtube
      </h1>

      <form className="mt-2" onSubmit={handleOnSubmit}>
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="url"
            pattern="https://www.youtube.com/playlist\?list=.*"
            id="default-search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter a youtube playlist url"
            required
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
          />
          <button
            type="submit"
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            disabled={loading}
          >
            Search{loading && "ing..."}
          </button>
        </div>
      </form>
      {videos.length && videos.map((el, i) => <VideoCard key={i} {...el} />)}
    </div>
  );
};

export default NewPlaylist;
