import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import methodOverride from "method-override";
import Post from "./models/Post.js";
import User from "./models/User.js";
import Task from "./models/tasks.js";
import { getNextId } from "./util/util.js";
import uri from "./util/uri.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

// Connect to MongoDB using Mongoose
async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

// Initialize database connection
await connectDB();

// Start server
app.listen(5500, function () {
  console.log("Server listening on port 5500");
});

// Routes

// GET / - Show write form
app.get("/", function (req, res) {
  res.send("API is running");
});

// POST /add - Add new post
app.post("/add", async function (req, res) {
  try {
    const nextId = await getNextId();

    const newPost = new Post({
      _id: nextId,
      title: req.body.title,
      date: req.body.date,
    });

    await newPost.save();
    console.log("Post added successfully");
    res.redirect("/");
  } catch (e) {
    console.error(e);
    res.status(500).send("Error adding post");
  }
});

// GET /list - Show all posts
app.get("/list", async function (req, res) {
  try {
    const posts = await Post.find({});
    res.render("list.ejs", { posts: posts });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching posts");
  }
});

// DELETE /delete - Delete a post
app.delete("/delete", async function (req, res) {
  try {
    const postId = parseInt(req.body._id);
    await Post.findByIdAndDelete(postId);

    console.log("Delete complete");
    res.send("Delete complete");
  } catch (e) {
    console.error(e);
    res.status(500).send("Error deleting post");
  }
});

// GET /detail/:id - Show post details
app.get("/detail/:id", async function (req, res) {
  try {
    const postId = parseInt(req.params.id);
    const post = await Post.findById(postId);

    if (post) {
      console.log("Detail page - Post found:", { data: post });
      res.render("detail.ejs", { data: post });
    } else {
      console.log("Post not found");
      res.status(404).send("Post not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching post details");
  }
});

// GET /edit/:id - Show edit form
app.get("/edit/:id", async function (req, res) {
  try {
    const postId = parseInt(req.params.id);
    const post = await Post.findById(postId);

    if (post) {
      console.log("Edit page - Post found:", { data: post });
      res.render("edit.ejs", { data: post });
    } else {
      console.log("Post not found");
      res.status(404).send("Post not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching post for editing");
  }
});

// PUT /edit - Update a post
app.put("/edit", async function (req, res) {
  try {
    const postId = parseInt(req.body.id);

    await Post.findByIdAndUpdate(postId, {
      title: req.body.title,
      date: req.body.date,
    });

    console.log("Update complete");
    res.redirect("/list");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating post");
  }
});

// API route - GET /listjson - Return posts as JSON
app.get("/listjson", async function (req, res) {
  try {
    const posts = await Post.find({});
    res.json(posts);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching posts");
  }
});

// API route - POST /users - Create a user document in Users collection
app.post("/users", async function (req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "username, email, and password are required" });
    }

    const newUser = await User.create({ username, email, password });
    return res.status(201).json({
      message: "User created",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ error: "Email already exists" });
    }
    console.error(error);
    return res.status(500).json({ error: "Error creating user" });
  }
});

// API route - POST /tasks - Create a task in Tasks collection
app.post("/tasks", async function (req, res) {
  try {
    const { title, description, status, startDate, endDate, completedAt, assignedTo } =
      req.body;

    if (!title || !description || !startDate || !assignedTo) {
      return res.status(400).json({
        error: "title, description, startDate, and assignedTo are required",
      });
    }

    const newTask = await Task.create({
      title,
      description,
      status: status || "todo",
      startDate,
      endDate,
      completedAt,
      assignedTo,
    });

    return res.status(201).json({
      message: "Task created",
      task: newTask,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creating task" });
  }
});

// API route - GET /tasks - List all tasks
app.get("/tasks", async function (req, res) {
  try {
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    return res.json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching tasks" });
  }
});

// API route - GET /tasks/:id - Get one task by id
app.get("/tasks/:id", async function (req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching task" });
  }
});

// API route - PUT /tasks/:id - Update one task by id
app.put("/tasks/:id", async function (req, res) {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.json({
      message: "Task updated",
      task: updatedTask,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error updating task" });
  }
});

// API route - DELETE /tasks/:id - Delete one task by id
app.delete("/tasks/:id", async function (req, res) {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.json({ message: "Task deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error deleting task" });
  }
});
