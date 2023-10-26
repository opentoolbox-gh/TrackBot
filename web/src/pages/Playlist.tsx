import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlaylistsContext } from "../App";
import { Playlist as PlaylistInterface } from "../utils/@types";
import NotFound from "../components/NotFound";
import VideoCard from "../components/VideoCard";
import StatisticsModal from "../components/StatisticsModal";

interface RouteParams {
  id: string;
  [key: string]: string | undefined;
}

const Playlist = () => {
  const { id } = useParams<RouteParams>();
  const { playlists } = useContext(PlaylistsContext);
  const [selectedPlaylist, setSelectedPlaylist] = useState<
    PlaylistInterface | undefined | null
  >(undefined);

  useEffect(() => {
    if (playlists) {
      const selectedPlaylist = playlists.find((el) => el.id === id) ?? null;
      setSelectedPlaylist(selectedPlaylist);
    }
  }, [id, playlists]);
  return (
    <div className="mid-center px-4 py-2">
      {selectedPlaylist === null ? (
        <NotFound what="playlist"/>
      ) : selectedPlaylist === undefined ? (
        <h1>Loading...</h1>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col  gap-4 w-full md:max-w-lg">
            <img
              src={selectedPlaylist.thumbnail}
              alt={selectedPlaylist.name}
              className="max-h-80 rounded w-full md:w-auto object-cover"
            />
            <p className="text-xl dark:text-white">
              {selectedPlaylist.description}
            </p>
            {selectedPlaylist.videos.every((el) => el.status === "watched") ? (
              <span className="bg-green-100 text-green-800 text-sm w-fit uppercase font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                Completed
              </span>
            ) : (
              <span className="bg-primary-100 text-primary-800 text-sm w-fit uppercase font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300">
                IN PROGRESS
              </span>
            )}
            <button
              type="button"
              className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-full text-sm px-5 py-2.5 text-center inline-flex gap-1 items-center mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-fit"
              data-modal-target="statisticsModal"
              data-modal-toggle="statisticsModal"
            >
              <svg width={24} height={24} viewBox="0 0 24 24">
                <path
                  fill="white"
                  d="M13 2.03v2.02c4.39.54 7.5 4.53 6.96 8.92c-.46 3.64-3.32 6.53-6.96 6.96v2c5.5-.55 9.5-5.43 8.95-10.93c-.45-4.75-4.22-8.5-8.95-8.97m-2 .03c-1.95.19-3.81.94-5.33 2.2L7.1 5.74c1.12-.9 2.47-1.48 3.9-1.68v-2M4.26 5.67A9.885 9.885 0 0 0 2.05 11h2c.19-1.42.75-2.77 1.64-3.9L4.26 5.67M15.5 8.5l-4.88 4.88l-2.12-2.12l-1.06 1.06l3.18 3.18l5.94-5.94L15.5 8.5M2.06 13c.2 1.96.97 3.81 2.21 5.33l1.42-1.43A8.002 8.002 0 0 1 4.06 13h-2m5.04 5.37l-1.43 1.37A9.994 9.994 0 0 0 11 22v-2a8.002 8.002 0 0 1-3.9-1.63Z"
                />
              </svg>
              Statistics
            </button>
            <StatisticsModal />
          </div>
          <div className="flex flex-col gap-2 grow">
            {selectedPlaylist.videos.map((el, i) => {
              return <VideoCard {...el} key={i} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Playlist;
