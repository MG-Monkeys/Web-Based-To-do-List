import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import methodOverride from "method-override";
import Post from "./models/Post.js";
import Task from "./models/Task.js";
import Tag from "./models/Tag.js";
import { getNextId } from "./util/util.js";
import uri from "./util/uri.js";

import deletePostbyTitle from "./functions.js"; "./functions.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));
app.use(express.json());

// Connect to MongoDB using Mongoose
async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (e) {
    console.error("MongoDB connection error:", e);
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

// GET / - 
app.get("/", function (req, res) {
  res.send("API is running");

  //TESTING FUNCTIONS
  //makePost("Test Post", "This is a test post", "test, example", "2024-12-31", "none", false, 0, 0);
  //deletePostbyTitle("TEST");

});

// TASKS

// GET /tasks - Show all tasks
app.get("/tasks", async function (req, res) {
  try {
    const tasks = await Task.find({});
    //res.render("list.ejs", { posts: posts });
    console.log("Task list: ", tasks);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching tasks");
  }
});

// GET /tasks/:id - Get one task by id
app.get("/tasks/:id", async function (req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.json(task);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error fetching task" });
  }
});

// GET /tasks/tag/:tag - get posts with "tag"
app.get("/tasks/tag/:tag", async function (req, res) {
  try {
    const tasks = await Task.find({ tags: req.params.tag });
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ error: "Tasks not found" });
    }
    return res.json(tasks);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching tasks");
  }
});

// POST /tasks - Add new task
app.post("/tasks", async function (req, res) {
  try {
    const { title, description, tags, startDate, endDate, assignedTo, groupId } =
      req.body;

    if (!title || !startDate || !endDate || !assignedTo) {
      return res.status(400).json({
        error: "title, startDate, endDate, and assignedTo are required",
      });
    }

    const newTask = await Task.create({
      title,
      description: description ?? "",
      tags, 
      startDate,
      endDate,
      editedAt: startDate,
      completedAt: null,
      assignedTo, 
      groupId: groupId ?? "", 
    });

    return res.status(201).json({
      message: "Task created",
      task: newTask,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error adding task");
  }
});

// UPDATE /tasks/:id - Update a task
app.put("/tasks/:id", async function (req, res) {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, });
    if(!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.json({
      message: "Task updated",
      task: updatedTask,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error updating task");
  }
});

// DELETE /delete - Delete a task
app.delete("/tasks/:id", async function (req, res) {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if(!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.json("Delete complete");
  } catch (e) {
    console.error(e);
    res.status(500).send("Error deleting task");
  }
});

// DELETE /delete - Delete a post by title
// ONLY FOR TESTING. ./functions.js -> deletePostbyTitle("TEST") comment for more details
// app.post("/delete/title", async function (req, res) {
//   console.log("FILTER: ", req.body.title);
//   try {
//     const response = await Post.deleteMany({title: req.body.title});

//     console.log("Delete complete: ", response);
//     res.send("Delete complete");
//   } catch (e) {
//     console.error(e);
//     res.status(500).send("Error deleting post");
//   }
// });

// TAGS

// GET /tags - get all tags
app.get("/tags", async function (req, res) {
  try {
    const tags = await Tag.find({});
    if(!tags || tags.length === 0) {
      return res.status(404).json({ error: "Tags not found" });
    }
    return res.json(tags);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching tags");
  }
});

// GET /tags - get tag by id
app.get("/tags/:id", async function (req, res) {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }

    return res.json(tag);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching tag");
  }
});

// POST /addTag - Add new tag
app.post("/tags", async function (req, res) {
  try {
    const nextId = await getNextId();

    const newTag = new Tag({
      _id: nextId,
      tagName: req.body.tagName,
    });

    await newTag.save();
    console.log("Tag added successfully");
    res.redirect("/");
  } catch (e) {
    console.error(e);
    res.status(500).send("Error adding tag");
  }
});

// DELETE /delete - Delete a tag
app.delete("/tags/:id", async function (req, res) {
  try {
    const deletedTag = await Tag.findByIdAndDelete(req.params.id);
    if(!deletedTag) {
      return res.status(404).json({ error: "Tag not found" });
    }

    return res.json("Delete complete");
  } catch (e) {
    console.error(e);
    res.status(500).send("Error deleting tag");
  }
});

// USERS

// GET /users/:id - Get a user by id
app.get("/users/:id", async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  }
  catch (error) {
    console.error("Error fetching users: ", error);
    res.status(500).json({ error: "Error fetching users" });
  }
})

// POST /users - Add new user
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

// UPDATE /users/:id - Update a user
app.put("/users/:id", async function (req, res) {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, });
    if(!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      message: "User updated",
      user: updatedUser,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error updating user");
  }
});

// DELETE /delete - Delete a User
app.delete("/users/:id", async function (req, res) {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if(!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json("Delete complete");
  } catch (e) {
    console.error(e);
    res.status(500).send("Error deleting User");
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
