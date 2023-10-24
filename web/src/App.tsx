import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Playlist from "./pages/Playlist";
import NavBar from "./components/NavBar";
import { createContext, useState } from "react";
import { Playlist as PlaylistInterface } from "./utils/@types";
import { playlists as dummyPlaylists } from "./utils/data";
import Login from "./pages/Login";

interface PlaylistsContextInterface {
  playlists: PlaylistInterface[];
  setPlaylists: React.Dispatch<React.SetStateAction<PlaylistInterface[]>>;
}

export const PlaylistsContext = createContext<PlaylistsContextInterface>({
  playlists: [],
  setPlaylists: () => {},
});

const App = () => {
  const [playlists, setPlaylists] = useState<PlaylistInterface[]>([
    ...dummyPlaylists,
  ]);

  return (
    <PlaylistsContext.Provider value={{ playlists, setPlaylists }}>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playlist/:id" element={<Playlist />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </PlaylistsContext.Provider>
  );
};

export default App;
