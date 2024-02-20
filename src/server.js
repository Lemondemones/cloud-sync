import express from "express";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";
import errorHandler from "./errorHandler.js";
import { runFileWatcher } from "../utils/watcher.js";

const app = express();
const { PORT, NEXTCLOUD_DIR } = process.env;

app.use(cors());
app.use(express.json());
app.use(helmet());

const init = async () => {
  try {
    runFileWatcher(NEXTCLOUD_DIR);
    console.log("Start watching...");
  } catch (error) {
    console.log(error);
  }
};

app.use(errorHandler);

app.listen(PORT || 5000, async () => {
  console.log(`Server running on port ${PORT} `);
  await init();
});
