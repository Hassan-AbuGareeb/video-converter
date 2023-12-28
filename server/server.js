const express = require("express");
const app = express();
const PORT = 3002;
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
      const fileExtension = format.container;
      const videoTitle = info.videoDetails.title;
      //create a write stream to save the video file
      const outputFilePath = `${videoTitle}.${fileExtension}`;
      const outputStream = fs.createWriteStream(`${outputFilePath}`);
      //download video file
      ytdl
        .downloadFromInfo(info, {
          format: format,
        })
        .pipe(outputStream);
      //when download finishes shows a message
      outputStream.on("finish", () => {
        const stat = fs.statSync(`${outputFilePath}`);
        res.status(200);
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Content-Length", stat.size);
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${videoTitle}.mp3`
        );
        //send the file to front end to download it from browser
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
