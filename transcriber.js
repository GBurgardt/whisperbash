// En transcriber.js
import axios from "axios";
import FormDataNew from "form-data";
import fs from "fs";
import { exec } from "child_process";

export function transcribeAudio(segmentPath) {
  // let data = new FormData();
  let data = new FormDataNew();
  data.append("file", fs.createReadStream(segmentPath));
  data.append("model", "whisper-1");
  const config = {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      ...data.getHeaders(),
    },
  };
  return axios
    .post("https://api.openai.com/v1/audio/transcriptions", data, config)
    .then(response => {
      console.log(response.data.text);

      exec(`echo ${response.data.text} | pbcopy`);
      return response.data.text;
    })
    .finally(() => fs.unlink(segmentPath, console.error));
}
