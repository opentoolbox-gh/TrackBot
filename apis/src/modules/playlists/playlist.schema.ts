import Joi from "joi";

const videoSchema = Joi.object({
    url: Joi.string().required(),
    thumbnail: Joi.string().required(),
    title: Joi.string()
        .required()
        .min(2)
        .max(100),
    status: Joi.string().valid('watched', 'isWatching', 'toWatch').default('toWatch'),
});

const playlistCreateSchema = Joi.object({
    name: Joi.string()
        .required()
        .min(2)
        .max(100),
    thumbnail: Joi.string().required(),
    description: Joi.string().required(),
    videos: Joi.array().items(videoSchema).required(),
});

export {
    playlistCreateSchema
}