const express = require("express");
const app = express();
const PORT = 3002;
const cors = require("cors");
app.use(cors());
app.get("/", (req, res) => {
  //   res.status(200);
  res.json({ message: "app working perfectly" });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
