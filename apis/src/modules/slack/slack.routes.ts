import { Router } from "express";
import { registerDefinition } from "swaggiffy";
import slackController from "./slack.controller";
const { App } = require('@slack/bolt');

export const {client: slackClient} = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: false,
});

const slackRouter = Router();

slackRouter.post("/interactivity", slackController.handleInteraction);
slackRouter.post("/command/done", slackController.handleDoneCommand);
slackRouter.post("/command/progress", slackController.handleProgressCommand);
slackRouter.post("/", slackController.handleSlackRequest);

export default slackRouter;

// registerDefinition(slackRouter, { tags: 'Slack', mappedSchema: 'Slack', basePath: '/slack' })
