import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlaylistsContext } from "../App";
import { Playlist as PlaylistInterface } from "../utils/@types";
import PlaylistNotFound from "../components/PlaylistNotFound";
import VideoCard from "../components/VideoCard";

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
        <PlaylistNotFound />
      ) : selectedPlaylist === undefined ? (
        <h1>Loading...</h1>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col  gap-4 w-full md:max-w-lg">
            <img
              src={selectedPlaylist.thumbnail}
              alt={selectedPlaylist.title}
              className="max-h-80 rounded w-full md:w-auto object-cover"
            />
            <p className="text-xl dark:text-white">{selectedPlaylist.description}</p>
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
