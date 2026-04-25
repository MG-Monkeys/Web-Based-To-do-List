import { useState } from "react";
import getFormattedDate from "../utils/getFormattedDate";
import { deleteTask } from "../utils/eventUtil";

export default function TaskModal({
  isOpen,
  onClose,
  setTasks,
  toCalendarTask,
  authUser,
  Colors,
  taskData,
  onAddTask,
  setTaskData,
}) {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formJson = Object.fromEntries(formData.entries());
    console.log("AAAAAALLLLLLDAYYYYYYY", formJson.allDay);

    const date = formJson.date;
    const startTime = formJson.startTime || "09:00";
    const endTime = formJson.endTime || "10:00";
    const isAllDay = formJson.allDay === "on";
    const start = isAllDay ? `${date}T00:00` : `${date}T${startTime}`;
    const end = isAllDay ? `${date}T23:59` : `${date}T${endTime}`;
    const tags = formJson.tags.split(",");
    const completed = formJson.completed;
    const newTask = {
      title: formJson.title,
      start,
      end,
      allDay: isAllDay,
      extendedProps: {
        description: formJson.description,
        tags: tags,
        completed: completed,
        reoccurrence: formJson.reoccurrence,
      },
    };

    setError("");
    setIsSubmitting(true);
    try {
      const task = await onAddTask(newTask);
      onClose();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isEditing = !!taskData.id;
  console.log(taskData);

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
        <p>{isEditing ? "Edit Task" : "New Task"}</p>
        <form onSubmit={handleSubmit}>
          {isEditing && (
            <label>
              <input
                type="checkbox"
                checked={taskData.completed || false}
                onChange={(e) =>
                  setTaskData({ ...taskData, completed: e.target.checked })
                }
              />
              Complete
            </label>
          )}
          <label>
            Title:
            <input
              type="text"
              placeholder="Title"
              name="title"
              required
              value={taskData.title}
              onChange={(e) =>
                setTaskData({ ...taskData, title: e.target.value })
              }
            />
          </label>
          <label>
            Date:
            <input
              type="date"
              name="date"
              defaultValue={getFormattedDate()}
              min="2026-02-01"
              max="2100-12-30"
              value={taskData.date || getFormattedDate()}
              onChange={(e) =>
                setTaskData({ ...taskData, date: e.target.value })
              }
            />
          </label>
          <div className="time-row">
            <label>
              Start Time:
              <input
                type="time"
                name="startTime"
                value={taskData.startTime || "09:00"}
                onChange={(e) =>
                  setTaskData({ ...taskData, startTime: e.target.value })
                }
              />
            </label>
            <label>
              End Time:
              <input
                type="time"
                name="endTime"
                value={taskData.endTime || "10:00"}
                onChange={(e) =>
                  setTaskData({ ...taskData, endTime: e.target.value })
                }
              />
            </label>
          </div>
          <label>
            All Day?
            <input
              type="checkbox"
              name="allDay"
              checked={!!taskData.allDay}
              onChange={(e) =>
                setTaskData({ ...taskData, allDay: e.target.checked })
              }
            />
          </label>
          <label>
            Repeat?
            <select
              name="reoccurrence"
              value={taskData.reoccurrence || "none"}
              onChange={(e) =>
                setTaskData({ ...taskData, reoccurrence: e.target.value })
              }
            >
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
          <label>
            Description:
            <textarea
              rows="4"
              cols="30"
              name="description"
              value={taskData.description}
              onChange={(e) =>
                setTaskData({ ...taskData, description: e.target.value })
              }
            />
          </label>
          <label>
            Tags:
            <input
              type="text"
              name="tags"
              placeholder="School, Work, Event, etc..."
              style={{ width: "60%" }}
              value={
                Array.isArray(taskData.tags)
                  ? taskData.tags.join(", ")
                  : taskData.tags
              }
              onChange={(e) =>
                setTaskData({ ...taskData, tags: e.target.value })
              }
            />
            <button
              class="ai-button"
              style={{ backgroundColor: Colors.tertiary }}
            >
              AI
            </button>
          </label>

          {error ? <p className="auth-message error">{error}</p> : null}
          <div>
            <button
              type="submit"
              className="modal-button"
              disabled={isSubmitting}
            >
              {isEditing ? "Save Changes" : isSubmitting ? "Adding..." : "Add"}
            </button>
            <button
              type="button"
              className="modal-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            {isEditing && (
              <button
                type="button"
                className="modal-button"
                onClick={() => {
                  deleteTask(taskData.id);
                  onClose();
                }}
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
