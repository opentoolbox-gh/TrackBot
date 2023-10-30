import { Router } from "express";
import { videoStatistics } from "./videos.controller";
import { registerDefinition } from "swaggiffy";

const videoRouter = Router();

videoRouter.get("/watched/:user_id", videoStatistics);

export default videoRouter;


registerDefinition(videoRouter, { tags: 'Video', mappedSchema: 'Video', basePath: '/video' });