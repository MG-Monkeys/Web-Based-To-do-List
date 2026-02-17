export default function TaskModal({ isOpen, onClose, onAddTask }) {
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    const newTask = {
      title: formJson.title,
      start: formJson.date + "T" + formJson.startTime,
      end: formJson.date + "T" + formJson.endTime,
      allDay: formJson.allDay === "true",
      description: formJson.description,
    };
    onAddTask(newTask);
    onClose();
  }
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>New Task</p>
        <form method="post" onSubmit={handleSubmit}>
          <label>
            Title:
            <input type="text" placeholder="Title" name="title" />
          </label>
          <br />
          <label>
            Date:
            <input
              type="Date"
              name="date"
              defaultValue="2026-02-17"
              min="2026-02-01"
              max="2100-12-30"
            />
          </label>
          <br />
          <label>
            Start Time:
            <input type="time" name="startTime" />
          </label>
          <br />
          <label>
            End Time:
            <input type="time" name="endTime" />
          </label>
          <br />
          <label>
            All Day?
            <input type="checkbox" name="allDay" value="false" />
          </label>
          <br />
          <label>
            Description:
            <textarea rows="4" cols="30" name="description" />
          </label>
          <div>
            <button type="submit">Add</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
