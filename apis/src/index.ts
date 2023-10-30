import express, { Application, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import { UnSuccessfulApiResponse } from "./helper/ApiResponse.helper";
import database_connection from "./helper/db.helper";
import { Swaggiffy } from "swaggiffy";

// Routes
import playlistRouter from "./modules/playlists/playlist.routes";
import slackRouter from "./modules/slack/slack.routes";
import videoRouter from "./modules/videos/video.routes";

database_connection();
const app: Application = express();
app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(cors())
  .use(morgan("tiny"))
  .use(helmet());

app.use("/playlist", playlistRouter);
app.use("/slack", slackRouter);
app.use("/video", videoRouter);

app.use("*", (req: Request, res: Response, next: NextFunction) => {
    console.log(req.baseUrl);
    if (req.baseUrl.includes("/api-docs")) return next();
    res.status(StatusCodes.NOT_FOUND).json(new UnSuccessfulApiResponse(false, "No such route on this server. Check /api-docs for documentation "));
});

new Swaggiffy().setupExpress(app).swaggiffy();

export default app;