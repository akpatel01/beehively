const mongoose = require("mongoose");
const User = require("../model/userModel");
const Post = require("../model/postModel");

const getPublicProfile = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "invalid user id" });
        }

        const user = await User.findById(id).select("name email");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const posts = await Post.find({
            author: id,
            status: "published",
            deletedAt: null,
        })
            .select("title content status tags createdAt updatedAt")
            .sort({ createdAt: -1 })
            .populate("author", "name email");

        return res.status(200).json({
            message: "Profile fetched successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            posts,
        });
    } catch (error) {
        console.error("Failed to fetch public profile", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = { getPublicProfile };


