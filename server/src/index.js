import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import Post from "./models/Post.js";
import Task from "./models/Task.js";
import Tag from "./models/Tag.js";
import User from "./models/User.js";
import Groups from "./models/Group.js";
import Invites from "./models/Invites.js";
import uri from "./util/uri.js";
import { GoogleGenAI } from "@google/genai";

import { Filter } from "bad-words";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import nodemailer from "nodemailer";
import { getTasksbyDate } from "./services/tasks.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// password hashing
const salt = await bcrypt.genSalt(10);

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

// JWT authentication middleware
const auth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const app = express();
const ai = new GoogleGenAI({});
const model = "gemini-2.5-flash";
const filter = new Filter();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
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
// app.get("/tasks", async function (req, res) {
//   try {
//     const tasks = await Task.find({});
//     if(!tasks || tasks.length === 0) {
//       return res.status(404).json({ error: "Tasks not found" });
//     }
//     return res.json(tasks);
//   } catch (e) {
//     console.error(e);
//     res.status(500).send("Error fetching tasks");
//   }
// });

// GET /tasks - Show all tasks for a user
app.get("/tasks/user/:AssignedTo", auth, async function (req, res) {
  try {
    const tasks = await Task.find({ assignedTo: req.params.AssignedTo });
    if(!tasks || tasks.length === 0) {
      return res.status(404).json({ error: "Tasks not found" });
    }
    return res.json(tasks);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching tasks");
  }
});

// GET /tasks - Show all tasks for a group
app.get("/tasks/group/:GroupId", auth, async function (req, res) {
  try {
    const tasks = await Task.find({ groupId: req.params.GroupId });
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ error: "Tasks not found" });
    }
    return res.json(tasks);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching tasks");
  }
});

// GET /tasks/:id - Get one task by id
app.get("/tasks/:id", auth, async function (req, res) {
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

// GET /tasks/due/:date - Get tasks due on a specific date
app.get("/tasks/due/:date", auth, async function (req, res) {
  try {
    const queryDate = new Date(req.params.date);
    const tasks = await Task.find({
      endDate: req.params.date,
      reoccurrence: "none",
    });
    const recurringTasks = await Task.find({ reoccurrence: { $ne: "none" } });

    for (const task of recurringTasks) {
      if (
        isTaskDueOnDate(task, queryDate) &&
        !isCompletedInPeriod(task, queryDate)
      ) {
        task.status = "completed";
        tasks.push(task);
      }
    }

    return res.json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching task" });
  }
});

// Helper: Check if recurring task is due on queryDate
function isTaskDueOnDate(task, queryDate) {
  const endDate = new Date(task.endDate);
  switch (task.reoccurrence) {
    case "daily":
      return true; // Daily tasks are always "due" on any date
    case "weekly":
      return endDate.getUTCDay() === queryDate.getUTCDay();
    case "monthly":
      return endDate.getUTCDate() === queryDate.getUTCDate();
    case "yearly":
      return (
        endDate.getUTCMonth() === queryDate.getUTCMonth() &&
        endDate.getUTCDate() === queryDate.getUTCDate()
      );
    default:
      return false;
  }
}

// Helper: Check if task was completed within the period for queryDate
function isCompletedInPeriod(task, queryDate) {
  if (!task.completedAt || task.completedAt.length === 0) return false;

  const { start, end } = getPeriodBounds(task.reoccurrence, queryDate);
  return task.completedAt.some((comp) => comp >= start && comp <= end);
}

// Helper: Get UTC start/end bounds for the period
function getPeriodBounds(reoccurrence, queryDate) {
  const year = queryDate.getUTCFullYear();
  const month = queryDate.getUTCMonth();
  const day = queryDate.getUTCDate();

  switch (reoccurrence) {
    case "daily":
      return {
        start: new Date(Date.UTC(year, month, day, 0, 0, 0)),
        end: new Date(Date.UTC(year, month, day, 23, 59, 59, 999)),
      };
    case "weekly":
      const weekStart = new Date(
        Date.UTC(year, month, day - queryDate.getUTCDay(), 0, 0, 0),
      );
      const weekEnd = new Date(
        Date.UTC(year, month, day - queryDate.getUTCDay() + 6, 23, 59, 59, 999),
      );
      return { start: weekStart, end: weekEnd };
    case "monthly":
      const monthStart = new Date(Date.UTC(year, month, 1, 0, 0, 0));
      const monthEnd = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999)); // Last day of month
      return { start: monthStart, end: monthEnd };
    case "yearly":
      const yearStart = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
      const yearEnd = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));
      return { start: yearStart, end: yearEnd };
    default:
      return { start: new Date(0), end: new Date(0) };
  }
}

// GET /tasks/tag/:tag - get posts with "tag"
app.get("/tasks/tag/:tag", auth, async function (req, res) {
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
app.post("/tasks", auth, async function (req, res) {
  try {
    const {
      title,
      description,
      tags,
      startDate,
      endDate,
      reoccurrence,
      assignedTo,
      groupId,
    } = req.body;

    if (!title || !startDate || !endDate || !assignedTo) {
      return res.status(400).json({
        error: "title, startDate, endDate, and assignedTo are required",
      });
    }

    if (filter.isProfane(title) || filter.isProfane(description)) {
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
      reoccurrence: reoccurrence ?? "none",
      assignedTo,
      groupId: groupId ?? "0",
    });

    return res.status(201).json({
      message: "Task created",
      task: newTask,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Error adding task" });
  }
});

// UPDATE /tasks/:id - Update a task
app.put("/tasks/:id", auth, async function (req, res) {
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
  } catch (e) {
    console.error(e);
    res.status(500).send("Error updating task");
  }
});

// UPDATE /tasks/:id - Update a task to completed and set completedAt
app.put("/tasks/completed/:id", auth, async function (req, res) {
  try {
    const updatedTask = await Task.findById(req.params.id);

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    let update = {};

    if (updatedTask.reoccurrence == "none") {
      update = { $set: { completedAt: new Date(), status: "completed" } };
    } else {
      let dates = updatedTask.completedAt ? updatedTask.completedAt : [];
      dates.push(new Date());
      update = { $set: { completedAt: dates } };
    }

    await updatedTask.updateOne(update, {
      new: true,
      runValidators: true,
    });

    return res.json({
      message: "Task updated",
      task: updatedTask,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error updating task" });
  }
});

// DELETE /delete - Delete a task
app.delete("/tasks/:id", auth, async function (req, res) {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
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

// Invites

// GET /invites/:recipientId - get invites for a user
app.get("/invites/:recipientId", auth, async function (req, res) {
  try {
    const invites = await Invites.find({ recipientId: req.params.recipientId });
    return res.json(invites);
  } catch (error) {
    console.error("Error fetching invites: ", error);
    res.status(500).json({ error: "Error fetching invites" });
  }
});

// POST /invites - create an invite
app.post("/invites", auth, async function (req, res) {
  try {
    const { senderName, senderId, recipientId, groupName, groupId } = req.body;

    const newInvite = await Invites.create({ senderName, senderId, recipientId, groupName, groupId });
    return res.status(201).json({
      message: "Invite created",
      invite: newInvite,
    });
  } catch (error) {
    console.error("Error creating invite: ", error);
    res.status(500).json({ error: "Error creating invite" });
  }
});

// DELETE /invites/delete/:id - delete an invite by id, use this for accepting or declining an invite
app.delete("/invites/delete/:id", auth, async function (req, res) {
  try {
    const deletedInvite = await Invites.findByIdAndDelete(req.params.id);
    if (!deletedInvite) {
      return res.status(404).json({ error: "Invite not found" });
    }
    return res.json({ message: "Invite deleted successfully" });
  } catch (error) {
    console.error("Error deleting invite: ", error);
    res.status(500).json({ error: "Error deleting invite" });
  }
});

// TAGS

// GET /tags - get all tags
app.get("/tags", async function (req, res) {
  try {
    const tags = await Tag.find({});
    if (!tags || tags.length === 0) {
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
app.post("/tags", auth, async function (req, res) {
  try {
    // Check if tag already exists
    const tag = await Tag.find({ tagName: req.body.tagName });
    if (tag && tag.length > 0) {
      return res.json({ message: "Tag already exists", tag: tag[0] });
    }

    if (filter.isProfane(req.body.tagName)) {
      return res.status(400).json({
        error: "Profanity detected in tag name",
      });
    }

    // create the tag otherwise
    const newTag = await Tag.create({ tagName: req.body.tagName });
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
app.delete("/tags/:id", auth, async function (req, res) {
  try {
    const deletedTag = await Tag.findByIdAndDelete(req.params.id);
    if (!deletedTag) {
      return res.status(404).json({ error: "Tag not found" });
    }

    return res.json("Delete complete");
  } catch (e) {
    console.error(e);
    res.status(500).send("Error deleting tag");
  }
});

// GROUPS

// GET /groups/:id - get group by id
app.get("/groups/:id", async function (req, res) {
  try {
    const group = await Groups.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    return res.json(group);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching group");
  }
});

// POST /groups - create a group
app.post("/groups/", auth, async function (req, res) {
  try {
    const { groupName, ownerId } = req.body;

    const newGroup = await Groups.create({ groupName, ownerId });
    return res.status(201).json({
      message: "Group created",
      group: newGroup,
    });
  } catch (error) {
    console.error("Error creating group: ", error);
    res.status(500).json({ error: "Error creating group" });
  }
});

// UPDATE /groups/:id - update a group name
app.put("/groups/:id", auth, async function (req, res) {
  try {
    const { groupName } = req.body;

    const updatedGroup = await Groups.findByIdAndUpdate(
      req.params.id,
      { groupName },
      { new: true, runValidators: true },
    );
    if (!updatedGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    return res.json({
      message: "Group updated",
      group: updatedGroup,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error updating group");
  }
});

// DELETE /groups/:id - delete a group
app.delete("/groups/:id", auth, async function (req, res) {
  try {
    const deletedGroup = await Groups.findByIdAndDelete(req.params.id);
    if (!deletedGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    return res.json("Delete complete");
  } catch (e) {
    console.error(e);
    res.status(500).send("Error deleting group");
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
    return res.json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Error fetching users: ", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// GET /users/username/:username - Get a user by username
app.get("/users/username/:username", async function (req, res) {
  try {
    const user = await User.findOne({username: req.params.username});
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  }
  catch (error) {
    console.error("Error fetching users: ", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// GET /users/groups/:id - Get a user's groups by id
app.get("/users/groups/:id", async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({
      groups: user.groups,
    });
  }
  catch (error) {
    console.error("Error fetching users: ", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// POST /users/signup - Add new user
app.post("/users/signup", async function (req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "username, email, and password are required" });
    }

    const newUser = await User.create({
      username: username.trim(),
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 10),
    });
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
app.put("/users/:id", auth, async function (req, res) {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
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

// UPDATE /users/acceptInvite - Add group to user
app.put("/users/acceptInvite/:id", auth, async function (req, res) {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: { groups: req.body.groups },
      },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      message: "User updated",
      user: updatedUser,
    });

    const deletedInvite = await Invites.findByIdAndDelete(req.body.inviteId);
    if (!deletedInvite) {
      return res.status(404).json({ error: "Invite not found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).send("Error updating user");
  }
});

// DELETE /delete - Delete a User
app.delete("/users/:id", auth, async function (req, res) {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json("Delete complete");
  } catch (e) {
    console.error(e);
    res.status(500).send("Error deleting User");
  }
});

// AUTH

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log("TOKEN: " + token)
  
  // Set HTTP-only cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: true, // Only send over HTTPS
    sameSite: 'strict',
    maxAge: 3600000 // 1 hour
  });
  
  res.json({ user: { id: user._id, username: user.username, email: user.email } });
});

// AI

// POST /ai - get AI response to make tags
app.post("/ai", async function (req, res) {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents:
        "Respond only with 1-3, comma separated, 1 word tags for a task with this title and description: " +
        req.body.title +
        " " +
        req.body.description,
    });
    const tags = response.text.split(",").map((tag) => tag.trim());
    return res.json({ response: response.text, tags: tags });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error getting AI response");
  }
});

// POST /ai/chat - get AI response for chat
app.post("/ai/chat", async function (req, res) {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents:
        "You are a helpful assistant in a calendar application. User: " +
        req.body.content,
    });
    return res.json({ response: response.text });
  } catch (e) {
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
