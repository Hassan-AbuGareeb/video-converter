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
  const destinationPath = "../../../../../mnt/c/Users/Home/Desktop/Downloads/";
  // get video info from youtube
  ytdl
    .getInfo(videoId)
    .then((info) => {
      //select video format and quality
      const format = ytdl.chooseFormat(info.formats, {
        quality: "highestaudio",
      });
      //create a write stream to save the video file
      const outputFilePath = `../../../../../mnt/c/Users/Home/Desktop/Downloads/${info.videoDetails.title}.${format.container}`;
      const outputStream = fs.createWriteStream(`${outputFilePath}`);
      //download video file
      ytdl
        .downloadFromInfo(info, {
          format: format,
        })
        .pipe(outputStream);
      //when download finishes shows a message
      outputStream.on("finish", () => {
        res.status(200);
        res.setHeader("Content-Type", "application/json");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${info.videoDetails.title}.json`
        );
        res.json({
          message: `finished downloading ${info.videoDetails.title}`,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
