export default function TaskModal({ isOpen, onClose, onAddTask }) {
  const handleSubmit = () => {
    const newTask = { title: "task1", start: Date.now(), allDay: true };
    onAddTask(newTask);
    onClose();
  };
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>New Task</p>
        <button onClick={handleSubmit}>Add</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
