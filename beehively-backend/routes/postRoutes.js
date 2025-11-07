const express = require("express");
const { createPost, getPosts } = require("../controllers/postController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/get-posts", getPosts);
router.post("/create-post", auth, createPost);

module.exports = router;


