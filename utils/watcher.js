import "dotenv/config";
import chokidar from "chokidar";

export function runFileWatcher(dir) {
  const watcher = chokidar.watch(dir, {
    ignored: [/(^|[\/\\])\../, /(^|[\/\\])appdata_ocbyr6147skr([\/\\]|$)/, "**/uploads/**", /test_imu/], // ignore dotfiles, appdata folder and upliads (chunks) folders
    persistent: true,
    // ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 120000,
      pollInterval: 100,
    },
  });

  const log = console.log.bind(console);

  watcher
    .on("add", (path) => log(`File ${path} has been added `))
    .on("unlink", (path) => log(`File ${path} has been removed`))
    .on("error", (error) => log(`Watcher error: ${error}`));
}
