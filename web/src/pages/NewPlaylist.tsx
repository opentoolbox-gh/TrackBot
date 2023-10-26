import axios from "axios";
import React from "react";
import VideoCard from "../components/VideoCard";
import { ScraperResponseVideo, Video } from "../utils/@types";

const NewPlaylist = () => {
  const [playlistUrl, setPlaylistUrl] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [videos, setVideos] = React.useState<Video[]>([]);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.get<ScraperResponseVideo[]>(
        `https://loader.to/api/ajax/playlistJSON?format=1080&api=dfcb6d76f2f6a9894gjkege8a4ab232222&limit=100&url=${playlistUrl}`
      );

      // if (!data.is_playlist) return;

      setVideos(
        data.map((el) => {
          return {
            title: el.info.title,
            link: el.url,
            thumbnail: el.info.thumbnail_url,
          };
        })
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
      <div className="flex flex-col gap-2 items-center mt-4 w-full">
        {videos.length && videos.map((el, i) => <VideoCard className="!w-full !max-w-6xl" key={i} {...el} />)}
      </div>
    </div>
  );
};

export default NewPlaylist;
