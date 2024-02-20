import "dotenv/config";
import chokidar from "chokidar";
import fs from "fs";
import axios from "axios";

// export async function sendFileToFTP(filePath) {
//   try {
//     const { FTP_URL } = process.env;
//     const fileStream = fs.createReadStream(filePath);
//     const response = await axios.post(FTP_URL, fileStream, {
//       headers: {
//         "Content-Type": "application/octet-stream",
//       },
//     });
//     console.log("File sent to server:", response.data);
//   } catch (error) {
//     throw new Error();
//   }
// }

// export function runFileWatcher(dir) {
//   const watcher = chokidar.watch(dir, {
//     ignored: [/(^|[\/\\])\../, /(^|[\/\\])appdata_ocbyr6147skr([\/\\]|$)/, "**/uploads/**", /test_imu/], // ignore dotfiles, appdata folder and upliads (chunks) folders
//     persistent: true,
//     ignoreInitial: true,
//     awaitWriteFinish: {
//       stabilityThreshold: 10000,
//       pollInterval: 100,
//     },
//   });

//   const log = console.log.bind(console);

//   watcher
//     .on("add", async (path) => {
//       log(`File ${path} has been added`);
//       await sendFileToServer(path); // Вызов функции отправки файла на сервер
//     })
//     .on("unlink", (path) => log(`File ${path} has been removed`))
//     .on("error", (error) => log(`Watcher error: ${error}`));
// }
export async function sendFileToFTP(filePath) {
  try {
    const { FTP_URL } = process.env;
    const fileStream = fs.createReadStream(filePath);
    const response = await axios.post(FTP_URL, fileStream, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
    console.log("File sent to FTP server:", response.data);
  } catch (error) {
    throw new Error("Error sending file to FTP server:", error);
  }
}

export function runFileWatcher(dir) {
  const watcher = chokidar.watch(dir, {
    ignored: [/(^|[\/\\])\../, /(^|[\/\\])appdata_ocbyr6147skr([\/\\]|$)/, "**/uploads/**", /test_imu/],
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 10000,
      pollInterval: 100,
    },
  });

  const log = console.log.bind(console);

  watcher
    .on("add", async (path) => {
      log(`File ${path} has been added`);
      await sendFileToFTP(path); // Используем функцию sendFileToFTP
    })
    .on("unlink", (path) => log(`File ${path} has been removed`))
    .on("error", (error) => log(`Watcher error: ${error}`));
}
