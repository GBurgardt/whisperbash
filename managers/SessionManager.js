import fs from "fs";
import os from "os";

export default function createSessionFolder() {
  const sessionFolder = `${os.homedir()}/recordings/session_${new Date()
    .toISOString()
    .replace(/:/g, "")
    .replace(/\..+/, "")}`;
  fs.mkdirSync(sessionFolder, { recursive: true });
  return sessionFolder;
}
