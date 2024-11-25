import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: String,
    email: String,
    password: String,
    apiKey: String
})

const UserModel = mongoose.model("user", userSchema)

export default UserModel