import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import methodOverride from "method-override";
import Post from "./models/Post.js";
import Task from "./models/Task.js";
import Tag from "./models/Tag.js";
import User from "./models/User.js";
import uri from "./util/uri.js";
import { GoogleGenAI } from "@google/genai";
import { Filter } from 'bad-words';
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
      // host: "smtp.ethereal.email",
      // port: 587,
      // secure: false, // Use true for port 465, false for port 587
      // 
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
          user: "monkeyseemonkeydo33333@gmail.com",
          pass: process.env.MSMD_EMAIL_PASS,
      },
    });

dotenv.config();

const app = express();
const ai = new GoogleGenAI({});
const model = "gemini-2.5-flash"
const filter = new Filter();


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
});

// TASKS

// GET /tasks - Show all tasks
app.get("/tasks", async function (req, res) {
  try {
    const tasks = await Task.find({});
    if(!tasks || tasks.length === 0) {
      return res.status(404).json({ error: "Tasks not found" });
    }
    return res.json(tasks);
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

    if(filter.isProfane(title) || filter.isProfane(description)) {
      return res.status(400).json({
        error: "Profanity detected in title or description",
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
      groupId: groupId ?? "0", 
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

// GET /tags/:id - get tag by id
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

// POST /tags - Add new tag
app.post("/tags", async function (req, res) {
  try {
    // Check if tag already exists
    const tag = await Tag.find({tagName: req.body.tagName});
    if (tag && tag.length > 0) {
      return res.json({ message: "Tag already exists", tag: tag[0] });
    }

    if(filter.isProfane(req.body.tagName)) {
      return res.status(400).json({
        error: "Profanity detected in tag name",
      });
    }

    // create the tag otherwise
    const newTag = await Tag.create({tagName: req.body.tagName});
    return res.status(201).json({
      message: "Tag created",
      tag: newTag,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error adding tag");
  }
});

// DELETE /tags/:id - Delete a tag
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

// AI

// POST /ai - test ai response to make tags
app.post("/ai", async function (req, res) {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: "Respond only with 1-3, comma separated, 1 word tags for a task with this title and description: " + req.body.title + " " + req.body.description
    });
    const tags = response.text.split(",").map(tag => tag.trim());
    return res.json({ response: response.text, tags: tags });
  }
  catch (e) {
    console.error(e);
    res.status(500).send("Error getting AI response");
  }
});

// EMAIL NOTIFICATIONS

// POST /notif - send email notification
app.post("/notif", async function (req, res) {
  try {
    const info = await transporter.sendMail({
      from: '"MonkeySee MonkeyDo" <monkeyseemonkeydo33333@gmail.com>',
      to: req.body.email,
      subject: req.body.subject,
      text: req.body.text, // Plain-text version of the message
      html: `<b>${req.body.text}</b>`, // HTML version of the message
    });

    return res.json({ message: "Email sent", info: await info });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error sending email");
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
