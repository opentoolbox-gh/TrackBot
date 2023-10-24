import express, { Application } from "express";

const port = process.env.PORT || 3000;
const app: Application = express();
app.use(express.json());

app.listen(port, () => {
  console.log("Listening on port " + port);
});
