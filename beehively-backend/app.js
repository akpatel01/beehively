const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./conn/db-connetion");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Auth API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
});

module.exports = app;

