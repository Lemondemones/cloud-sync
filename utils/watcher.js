import "dotenv/config";
import chokidar from "chokidar";
import { sendEmailNotification } from "../service/mailService.js";
import path from "path";

let fileAddList = {}; // Объект для хранения массивов файлов для каждого пользователя
let timer = {}; // Объект для хранения таймеров для каждого пользователя

export function runFileWatcher(dir) {
  const watcher = chokidar.watch(dir, {
    ignored: [
      /(^|[\/\\])\../,
      /(^|[\/\\])appdata_ocbyr6147skr([\/\\]|$)/,
      "**/uploads/**",
      /test_imu/,
      /(^|[\/\\])appdata_oc0bpjvrucpr([\/\\]|$)/,
      /(^|[\/\\])files_trashbin([\/\\]|$)/,
    ],
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 120000,
      pollInterval: 100,
    },
  });

  const log = console.log.bind(console);

  watcher
    .on("add", async (filePath) => {
      const userDir = path.basename(path.dirname(path.dirname(filePath)));

      if (!fileAddList[userDir]) {
        fileAddList[userDir] = [];
      }

      fileAddList[userDir].push(filePath);

      if (timer[userDir]) {
        clearTimeout(timer[userDir]);
      }

      timer[userDir] = setTimeout(() => {
        sendEmailNotification(userDir, fileAddList[userDir]);
        fileAddList[userDir] = [];
        clearTimeout(timer[userDir]);
        timer[userDir] = null;
      }, 5000);

      log(`New file detected: ${filePath}`);
    })
    .on("error", async (error) => {
      log(`Watcher error: ${error}`);
      await sendEmailNotification(error);
    });
}
