const express = require("express");
const fs = require("fs").promises; // fs.promises 사용
const path = require("path");

const router = express.Router();

router.get("/images", async (req, res) => {
  try {
    const imagesDir = path.join(__dirname, "../../client/src/image/EventImage");
    const files = await fs.readdir(imagesDir);
    const imagePromises = files.map(async (file) => {
      const filePath = path.join(imagesDir, file);
      const stat = await fs.stat(filePath);
      return {
        name: file,
        date: stat.mtime,
      };
    });
    const images = await Promise.all(imagePromises);
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: "Failed to read directory or file stats" });
  }
});

module.exports = router;
