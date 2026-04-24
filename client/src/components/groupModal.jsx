export default function GroupModal({ isOpen, onClose, Colors }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p>Create A Group:</p>
        <label>
          Name:
          <input type="text" />
        </label>
      </div>
    </div>
  );
}
