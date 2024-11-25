import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: String,
    content: String,
}, {timestamps: true})

const PostModel = mongoose.model("post", postSchema)

export default PostModel