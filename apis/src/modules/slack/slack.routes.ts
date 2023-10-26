import { Router } from "express";
import { registerDefinition } from "swaggiffy";
import slackController from "./slack.controller";

const slackRouter = Router();

slackRouter.post('/', slackController.handleSlackRequest)

export default slackRouter;

registerDefinition(slackRouter, { tags: 'Slack', mappedSchema: 'Slack', basePath: '/slack' })