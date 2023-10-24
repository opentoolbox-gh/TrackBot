import Playlist from "../components/Playlist";
import { playlists } from "../utils/data";
import { Playlist as PlaylistInterface } from "../utils/@types";

const Home = () => {
  return (
    <div>
      <main className="mid-center px-4">
        {/* <h1>Today's videos</h1> */}
        <section className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl text-gray-600 dark:text-white">
            Other Playlists
          </h1>
          <div className="playlists flex flex-wrap  gap-2">
            {playlists.map((el: PlaylistInterface, i: number) => {
              return <Playlist {...el} key={i} />;
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
