import "dotenv/config";
import chokidar from "chokidar";
import { sendEmailNotification } from "../service/mailService.js";

let fileAddList = []; //массив добавленных файлов
let timer;

export function runFileWatcher(dir) {
  const watcher = chokidar.watch(dir, {
    ignored: [/(^|[\/\\])\../, /(^|[\/\\])appdata_ocbyr6147skr([\/\\]|$)/, "**/uploads/**", /test_imu/],
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 5000,
      pollInterval: 100,
    },
  });

  const log = console.log.bind(console);

  watcher
    .on("add", async (filePath) => {
      console.log(`New file detected: ${filePath}`);
      await sendEmailNotification(filePath);
    })
    .on("error", async (error) => {
      log(`Watcher error: ${error}`);
      await sendEmailNotification(error);
    });
}
