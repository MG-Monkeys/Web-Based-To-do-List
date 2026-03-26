import getFormattedDate from "../utils/getFormattedDate";

export default function TaskModal({ isOpen, onClose, onAddTask, Colors }) {
  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formJson = Object.fromEntries(formData.entries());
    const newTask = {
      id: crypto.randomUUID(),
      title: formJson.title,
      start: formJson.date + "T" + formJson.startTime,
      end: formJson.date + "T" + formJson.endTime,
      allDay: formJson.allDay,
      repeat: formJson.repeat,
      description: formJson.description,
    };
    console.log(newTask);
    onAddTask(newTask);
    onClose();
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
            <input type="text" placeholder="Title" name="title" />
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
              <input type="time" name="startTime" />
            </label>
            <label>
              End Time:
              <input type="time" name="endTime" />
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
          <div>
            <button type="submit" className="modal-button" style={{ backgroundColor: Colors.tertiary }}>
              Add
            </button>
            <button type="button" className="modal-button" onClick={onClose} style={{ backgroundColor: Colors.tertiary }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
