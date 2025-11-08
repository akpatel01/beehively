const express = require("express");
const { createPost, getPosts, getPostById, updatePost, deletePost, bulkDeletePosts, restorePosts } = require("../controllers/postController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/get-posts", getPosts);
router.get("/get-post/:id", getPostById);
router.post("/create-post", auth, createPost);
router.put("/update-post/:id", auth, updatePost);
router.delete("/delete-post/:id", auth, deletePost);
router.post("/bulk-delete", auth, bulkDeletePosts);
router.post("/restore-posts", auth, restorePosts);

module.exports = router;


