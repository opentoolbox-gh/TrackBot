import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Playlist from "./pages/Playlist";
import NavBar from "./components/NavBar";
import { createContext, useEffect, useState } from "react";
import { Playlist as PlaylistInterface } from "./utils/@types";
// import { playlists as dummyPlaylists } from "./utils/data";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import NewPlaylist from "./pages/NewPlaylist";
import { axios } from "./utils/axios.config";

interface PlaylistsContextInterface {
  playlists: PlaylistInterface[];
  setPlaylists: React.Dispatch<React.SetStateAction<PlaylistInterface[]>>;
}

export const PlaylistsContext = createContext<PlaylistsContextInterface>({
  playlists: [],
  setPlaylists: () => {},
});

const App = () => {
  const [playlists, setPlaylists] = useState<PlaylistInterface[]>([]);

  const fetchPlaylists = async () => {
    try {
      const { data } = await axios.get<{success: boolean, data: PlaylistInterface[]}>("/playlist/all");
      setPlaylists(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("Fetching the playlists...");
    // setTimeout(() => {
    //   setPlaylists(dummyPlaylists);
    // }, 2000);
    fetchPlaylists()
  }, []);

  return (
    <PlaylistsContext.Provider value={{ playlists, setPlaylists }}>
      <BrowserRouter>
        <main className="main-content-container">
        <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playlist/:id" element={<Playlist />} />
            <Route path="/playlist/new" element={<NewPlaylist />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound what="page" />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </PlaylistsContext.Provider>
  );
};

export default App;
