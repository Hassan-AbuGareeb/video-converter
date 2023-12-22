const express = require("express");
const app = express();
const PORT = 3003;
const cors = require("cors");
app.use(cors());

const ytdl = require("ytdl-core");
const fs = require("fs");

app.get("/", (req, res) => {
  res.status(200);
  res.json({ message: "app working perfectly" });
});

app.get("/:id", (req, res) => {
  const videoId = req.params.id;
  // get video info from youtube
  ytdl
    .getInfo(videoId)
    .then((info) => {
      //select video format and quality
      const format = ytdl.chooseFormat(info.formats, {
        quality: "highestaudio",
      });
      //create a write stream to save the video file
      const outputFilePath = `${info.videoDetails.title}.${format.container}`;
      const outputStream = fs.createWriteStream(`${outputFilePath}`);
      //download video file
      ytdl
        .downloadFromInfo(info, {
          format: format,
        })
        .pipe(outputStream);
      //when download finishes shows a message
      outputStream.on("finish", () => {
        const stat = fs.statSync(
          `${info.videoDetails.title}.${format.container}`
        );
        res.status(200);
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Content-Length", stat.size);
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${info.videoDetails.title}.mp3`
        );
        fs.createReadStream(outputFilePath).pipe(res);
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error converting video" });
    });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports.handler = serverless(app);
