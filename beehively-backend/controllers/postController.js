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

module.exports = { createPost, getPosts };


