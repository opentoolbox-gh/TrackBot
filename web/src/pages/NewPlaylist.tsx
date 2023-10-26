import { axios } from "../utils/axios.config";
import React from "react";
import VideoCard from "../components/VideoCard";
import { Playlist, ScraperResponseVideo, Video } from "../utils/@types";
import { AxiosResponse } from "axios";

const NewPlaylist = () => {
  const [playlistUrl, setPlaylistUrl] = React.useState<string>("");
  const [fetchingPlaylist, setFetchingPlaylist] =
    React.useState<boolean>(false);
  const [savingPlaylist, setSavingPlaylist] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState<Playlist>({
    description: "",
    name: "",
    thumbnail: "",
    videos: [],
  });

  const updateFormData = (key: keyof Playlist, val: string) =>
    setFormData({ ...formData, [key]: val });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateFormData(name as keyof Playlist, value);
  };

  const handleOnPlaylistFetch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setFetchingPlaylist(true);
      const { data } = await axios.get<ScraperResponseVideo[]>(
        `https://loader.to/api/ajax/playlistJSON?format=1080&api=dfcb6d76f2f6a9894gjkege8a4ab232222&limit=100&url=${playlistUrl}`
      );

      if (!data.length) return;
      const vids = data.map((el) => {
        return {
          title: el.info.title,
          link: el.url,
          thumbnail: el.info.thumbnail_url,
        };
      });
      setFormData({
        ...formData,
        videos: vids,
        thumbnail: vids[0].thumbnail,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setFetchingPlaylist(false);
    }
  };

  const handleOnPlaylistSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.values(formData).some((val) => val.length === 0)) {
      console.log(formData);
      return alert(
        "Some Data is missing (" +
          Object.values(formData)
            .map((val, i) =>
              val.length === 0 ? null : Object.keys(formData)[i]
            )
            .filter((el) => el === null)
            .join(",") +
          ")"
      );
    }

    try {
      setSavingPlaylist(true);
      const { data } = await axios.post<
        Video[],
        AxiosResponse<Video[]>,
        Playlist
      >(`/playlist/create`, {
        ...formData,
        thumbnail: formData.videos[0].thumbnail,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setSavingPlaylist(false);
    }
  };
  return (
    <div className="mid-center px-4 py-2">
      <h1 className="text-3xl dark:text-white font-bold">
        Create a new playlist from youtube
      </h1>

      <div className="flex flex-col gap-2 mt-2">
        <form className="flex-grow" onSubmit={handleOnPlaylistFetch}>
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
              disabled={fetchingPlaylist}
            >
              Search{fetchingPlaylist && "ing..."}
            </button>
          </div>
        </form>
        <form
          action=""
          className={
            "flex flex-col gap-2 " +
            (formData.videos.length ? "" : "hidden scale-0")
          }
          onSubmit={handleOnPlaylistSave}
        >
          <label
            htmlFor="small-input"
            className="block text-sm font-medium text-gray-900 dark:text-white"
          >
            Playlist Name
          </label>
          <div
          //  className="flex flex-col sm:flex-row gap-2 sm:items-center"
          >
            <input
              type="text"
              id="small-input"
              name="name"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 grow"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Description
            </label>
            <textarea
              id="message"
              name="description"
              rows={4}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Briefly describe the playlist"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            disabled={savingPlaylist}
            className={
              "text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded text-sm px-5 py-2.5 text-center mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 grow-0 w-fit "
            }
          >
            Sav{savingPlaylist ? "ing..." : "e"}
          </button>
        </form>
      </div>
      <div className="flex flex-col gap-2 items-center mt-4 w-full">
        {formData.videos.length &&
          formData.videos.map((el, i) => (
            <VideoCard className="!w-full !max-w-6xl" key={i} {...el} />
          ))}
      </div>
    </div>
  );
};

export default NewPlaylist;
