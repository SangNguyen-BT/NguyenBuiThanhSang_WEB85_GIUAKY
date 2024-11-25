import express from "express";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

import UserModel from "./model/user.js";
import PostModel from "./model/post.js";

import { authenUser } from "./middleware/checkApiKey.js";

mongoose.connect(
  "mongodb+srv://kennySang:dragon9076@cluster0.r6njk.mongodb.net/MidTest"
);

const app = express();
app.use(express.json());

// Task 1
app.post("/users/register", async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json({ message: "Data missing" });
    }

    const existedUser = await UserModel.findOne({ email });
    if (existedUser)
      return res.status(400).json({ message: "Email already exists" });

    const newUser = await UserModel.create({
      userName,
      email,
      password,
    });

    res.status(201).send({
      message: "Register successfully",
      data: newUser,
      success: true,
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// Task 2
app.post("/users/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Data missing" });
    }

    const user = await UserModel.findOne({ email, password });
    if (!user)
      return res.status(400).json({ message: "Wrong email or password" });

    const randomString = uuidv4();

    const apiKey = `mern-${user._id}$-${email}$-${randomString}$`;
    user.apiKey = apiKey;
    await user.save();

    res.status(201).send({
      message: "Login successfully!",
      apiKey,
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// Task 3
app.post("/posts", authenUser, async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Insert Content" });

    const user = req.user;
    const post = await PostModel.create({
      userId: user._id,
      content,
    });

    res.status(201).send({
      message: "Create post successfully!",
      post,
      success: true,
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// Task 4
app.put("/posts/:id", authenUser, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const user = req.user;

    const post = await PostModel.findOne({ _id: id, userId: user.id });

    if (!post) return res.status(400).json({ message: "Invalid Post" });

    post.content = content || post.content;
    await post.save();

    res.status(201).send({
      message: "Updated post successfully!",
      post,
      success: true,
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

app.listen(8080, () => {
  console.log("Server is running");
});
