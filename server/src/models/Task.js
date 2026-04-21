import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },
    tags: {
      type: [String],
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: ["todo", "in_progress", "completed"],
      default: "todo",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: false,
    },
    editedAt: {
      type: Date,
      required: false,
    },
    completedAt: {
      type: [Date],
      required: false,
    },
    reoccurrence: {
      type: String,
      required: false,
      enum: ["none", "daily", "weekly", "monthly", "yearly"],
      default: "none",
    },
    assignedTo: {
      type: String,
      required: true,
      trim: true,
    },
    groupId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Task = mongoose.model("Task", taskSchema, "Tasks");

export default Task;
