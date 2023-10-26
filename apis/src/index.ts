import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import { UnSuccessfulApiResponse } from "./helper/ApiResponse.helper";
import database_connection from "./helper/db.helper";

// Routes
import playlistRouter from "./modules/playlists/playlist.routes";

database_connection();
const app: Application = express();
app.use(express.json()).use(cors()).use(morgan('tiny')).use(helmet());

app.use("/playlist", playlistRouter);

app.all("*", (req: Request, res: Response) => {
    res.status(StatusCodes.NOT_FOUND).json(new UnSuccessfulApiResponse(false, "No such route on this server."));
});

export default app;