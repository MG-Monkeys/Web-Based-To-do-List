import { useState } from "react";
import getFormattedDate from "../utils/getFormattedDate";

export default function TaskModal({ isOpen, onClose, onAddTask, Colors }) {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formJson = Object.fromEntries(formData.entries());

    const date = formJson.date;
    const startTime = formJson.startTime || "09:00";
    const endTime = formJson.endTime || "10:00";
    const isAllDay = formJson.allDay === "on";
    const start = isAllDay ? `${date}T00:00` : `${date}T${startTime}`;
    const end = isAllDay ? `${date}T23:59` : `${date}T${endTime}`;
    const newTask = {
      title: formJson.title,
      start,
      end,
      allDay: isAllDay,
      description: formJson.description,
    };

    setError("");
    setIsSubmitting(true);
    try {
      await onAddTask(newTask);
      onClose();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{ color: Colors.text }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: Colors.primary }}
      >
        <p>New Task</p>
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input type="text" placeholder="Title" name="title" required />
          </label>
          <label>
            Date:
            <input
              type="date"
              name="date"
              defaultValue={getFormattedDate()}
              min="2026-02-01"
              max="2100-12-30"
            />
          </label>
          <div className="time-row">
            <label>
              Start Time:
              <input type="time" name="startTime" defaultValue="09:00" />
            </label>
            <label>
              End Time:
              <input type="time" name="endTime" defaultValue="10:00" />
            </label>
          </div>
          <label>
            All Day?
            <input type="checkbox" name="allDay" />
          </label>
          <label>
            Repeat?
            <select name="repeat">
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
          <label>
            Description:
            <textarea rows="4" cols="30" name="description" />
          </label>
          {error ? <p className="auth-message error">{error}</p> : null}
          <div>
            <button type="submit" className="modal-button" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add"}
            </button>
            <button
              type="button"
              className="modal-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
