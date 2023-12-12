import mic from "mic";
import fs from "fs";
import readline from "readline";
import { transcribeAudio } from "./transcriber.js";
import micConfig from "./micConfig.js";

// var micInstance = mic({
//   rate: "16000",
//   channels: "1",
//   debug: true,
//   exitOnSilence: 6,
//   fileType: "wav",
// });

var micInstance = mic(micConfig);

var outputFileStream = fs.createWriteStream("output.wav");
var micInputStream = micInstance.getAudioStream();

micInputStream.on("data", function (data) {
  console.log("Recibiendo flujo de entrada: " + data.length);
});

micInputStream.pipe(outputFileStream);
micInstance.start();
console.log("Grabando... Presiona ENTER para detener.");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", input => {
  micInstance.stop();
  console.log("Grabación detenida.");
  transcribeAudio("output.wav")
    .then(transcription => {
      console.log("Transcripción: ", transcription);
    })
    .catch(err => {
      console.error("Error en la transcripción: ", err);
    });
  rl.close();
});

// // cree esta funcion nueva
// function transcribeAudio(segmentPath) {
//   // let data = new FormData();
//   let data = new FormDataNew();
//   data.append("file", fs.createReadStream(segmentPath));
//   data.append("model", "whisper-1");
//   const config = {
//     headers: {
//       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       ...data.getHeaders(),
//     },
//   };
//   return axios
//     .post("https://api.openai.com/v1/audio/transcriptions", data, config)
//     .then(response => {
//       console.log(response.data.text);

//       exec(`echo ${response.data.text} | pbcopy`);
//       return response.data.text;
//     })
//     .finally(() => fs.unlink(segmentPath, console.error));
// }
