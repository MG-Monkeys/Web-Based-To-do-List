import mongoose from "mongoose";

const recurrenceRuleSchema = new mongoose.Schema(
  {
    frequency: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly"],
      default: "none",
    },
    interval: {
      type: Number,
      min: 1,
      default: 1,
    },
    daysOfWeek: {
      type: [Number],
      default: [],
      validate: {
        validator(values) {
          return values.every((value) => Number.isInteger(value) && value >= 0 && value <= 6);
        },
        message: "daysOfWeek must contain integers from 0 to 6",
      },
    },
    dayOfMonth: {
      type: Number,
      min: 1,
      max: 31,
      default: null,
    },
    until: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
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
    completedAt: {
      type: Date,
      required: false,
    },
    completionDates: {
      type: [Date],
      default: [],
    },
    recurrenceRule: {
      type: recurrenceRuleSchema,
      default: () => ({
        frequency: "none",
        interval: 1,
        daysOfWeek: [],
        dayOfMonth: null,
        until: null,
      }),
    },
    assignedTo: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema, "Tasks");

export default Task;
