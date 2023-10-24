import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlaylistsContext } from "../App";
import { Playlist as PlaylistInterface } from "../utils/@types";
import PlaylistNotFound from "../components/PlaylistNotFound";

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
  return <div className="mid-center px-4 py-2">
    {
        selectedPlaylist === null ? <PlaylistNotFound /> : selectedPlaylist === undefined ? <h1>Loading...</h1> : <div>Found playlist</div>
    }
  </div>;
};

export default Playlist;
