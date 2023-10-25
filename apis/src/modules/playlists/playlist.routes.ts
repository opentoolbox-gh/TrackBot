import { Router } from "express";
import { registerDefinition } from "swaggiffy";
import playlistController from "./playlist.controller";

const playlistRouter = Router();

playlistRouter.get("/all", playlistController.getAllPlaylists);
playlistRouter.post("/create", playlistController.createPlaylist);
playlistRouter.get("/get/:playlist_id", playlistController.getPlaylistById);
playlistRouter.delete("/delete/:playlist_id", playlistController.deletePlaylist);

export default playlistRouter

registerDefinition(playlistRouter, { tags: 'Playlists', mappedSchema: 'Playlist', basePath: '/playlist' });