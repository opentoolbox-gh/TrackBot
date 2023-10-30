import { Router } from "express";
import * as videoController from "./videos.controller"
import { registerDefinition } from "swaggiffy";

const videoRouter = Router();

videoRouter.get("/watched/:user_id", videoController.videoStatistics);
videoRouter.put("/set-as-today/:video_id", videoController.setTodaysVideo);
videoRouter.get("/statistics/:date", videoController.getVideosForDate);             

export default videoRouter;


registerDefinition(videoRouter, { tags: 'Video', mappedSchema: 'Video', basePath: '/video' });