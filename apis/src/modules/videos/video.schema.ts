import Joi from "joi";

export const videoSchema = Joi.object({
    url: Joi.string().required(),
    thumbnail: Joi.string().required(),
    title: Joi.string()
        .required()
        .min(2)
        .max(100),
    status: Joi.string().valid('watched', 'isWatching', 'toWatch').default('toWatch'),
    date: Joi.date().optional()
});