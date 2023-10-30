import { Router } from "express";
import { registerDefinition } from "swaggiffy";
import playlistController from "./playlist.controller";

const playlistRouter = Router();

playlistRouter.get("/all", playlistController.getAllPlaylists);
playlistRouter.post("/create", playlistController.createPlaylist);
playlistRouter.get("/get/:playlist_id", playlistController.getPlaylistById);
playlistRouter.delete("/delete/:playlist_id", playlistController.deletePlaylist);
playlistRouter.put("/remove/video/:playlist_id/:video_id", playlistController.removeVideoFromPlaylist);
playlistRouter.put("/add/video/:playlist_id", playlistController.addVideoToPlaylist);
playlistRouter.put("/update/info/:playlist_id", playlistController.updatePlaylistInfo);
export default playlistRouter

registerDefinition(playlistRouter, { tags: 'Playlist', mappedSchema: 'Playlist', basePath: '/playlist' });