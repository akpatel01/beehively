const mongoose = require("mongoose");
const Post = require("../model/postModel");

const createPost = async (req, res) => {
    try {
        const { title, content, status = "draft", tags = [] } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!title || !content) {
            return res.status(400).json({ message: "title and content are required" });
        }

        const allowedStatuses = ["draft", "published", "archived"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "invalid status" });
        }

        const normalizedTags = Array.isArray(tags)
            ? tags
            : String(tags)
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean);

        const post = await Post.create({
            title,
            content,
            status,
            tags: normalizedTags,
            author: req.user.id,
        });

        return res.status(201).json({
            message: "Post created successfully",
            post,
        });
    } catch (error) {
        console.error("Failed to create post", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

const getPosts = async (req, res) => {
    try {
        const { status, author } = req.query;

        const filters = {};

        if (status) {
            const allowedStatuses = ["draft", "published", "archived"];
            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({ message: "invalid status" });
            }
            filters.status = status;
        }

        if (author) {
            filters.author = author;
        }

        const posts = await Post.find(filters)
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Posts fetched successfully",
            posts,
        });
    } catch (error) {
        console.error("Failed to list posts", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

const getPostById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "invalid post id" });
        }

        const post = await Post.findById(id).populate("author", "name email");

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.status(200).json({
            message: "Post fetched successfully",
            post,
        });
    } catch (error) {
        console.error("Failed to fetch post", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, status, tags } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "invalid post id" });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const updates = {};

        if (typeof title !== "undefined") {
            if (!title || !title.trim()) {
                return res.status(400).json({ message: "title is required" });
            }
            updates.title = title;
        }

        if (typeof content !== "undefined") {
            if (!content || !content.trim()) {
                return res.status(400).json({ message: "content is required" });
            }
            updates.content = content;
        }

        if (typeof status !== "undefined") {
            const allowedStatuses = ["draft", "published", "archived"];
            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({ message: "invalid status" });
            }
            updates.status = status;
        }

        if (typeof tags !== "undefined") {
            const normalizedTags = Array.isArray(tags)
                ? tags
                : String(tags)
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean);
            updates.tags = normalizedTags;
        }

        Object.assign(post, updates);
        await post.save();
        await post.populate("author", "name email");

        return res.status(200).json({
            message: "Post updated successfully",
            post,
        });
    } catch (error) {
        console.error("Failed to update post", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "invalid post id" });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await post.deleteOne();

        return res.status(200).json({
            message: "Post deleted successfully",
        });
    } catch (error) {
        console.error("Failed to delete post", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };


