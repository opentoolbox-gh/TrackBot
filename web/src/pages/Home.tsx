import { useContext } from "react";
import Playlist, { PlaylistSkeleton } from "../components/Playlist";
import { Playlist as PlaylistInterface } from "../utils/@types";
import { PlaylistsContext } from "../App";
import { Link } from "react-router-dom";

const Home = () => {
  const { playlists } = useContext(PlaylistsContext);

  return (
    <div>
      <main className="mid-center px-4">
        {/* <h1>Today's videos</h1> */}
        <section className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl text-gray-600 dark:text-white">
            Other Playlists
          </h1>
          <div className="playlists flex flex-wrap  gap-2">
            {playlists.length
              ? playlists.map((el: PlaylistInterface, i: number) => {
                  return <Playlist {...el} key={i} />;
                  // return <PlaylistSkeleton key={i} />;
                })
              : Array(5)
                  .fill(0)
                  .map((_, i) => {
                    return <PlaylistSkeleton key={i} />;
                  })}
            {
              // check if user is logged in
              true && (
                <Link
                  to="/playlist/new"
                  className="max-w-sm w-full h-52 p-4 border border-gray-200 rounded shadow md:p-6 dark:border-gray-700 dark:text-white flex items-center justify-center flex-col cursor-pointer"
                >
                  <span className="text-6xl">+</span>
                  <span className="text-xl">Create a new playlist</span>
                </Link>
              )
            }
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
