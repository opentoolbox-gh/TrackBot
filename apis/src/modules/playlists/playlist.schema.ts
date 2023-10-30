import Joi from "joi";
import { videoSchema } from "../videos/video.schema";

const playlistCreateSchema = Joi.object({
    name: Joi.string()
        .required()
        .min(2)
        .max(100),
    thumbnail: Joi.string().required(),
    description: Joi.string().required(),
    videos: Joi.array().items(videoSchema).required(),
});

const playlistUpdateSchema = Joi.object({
    name: Joi.string().optional().min(2).max(100),
    thumbnail: Joi.string().optional(),
    description: Joi.string().optional(),
});

export {
    playlistCreateSchema,
    playlistUpdateSchema
}