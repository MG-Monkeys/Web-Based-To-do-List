export default function LoginModal({ isOpen, onClose, Colors }) {
  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: Colors.primary, color: Colors.primaryText }}
      >
        <p>Log In</p>
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input type="email" placeholder="example@email.com" name="email" />
          </label>
          <label>
            Password:
            <input type="password" name="password" />
          </label>
          <div>
            <button type="submit" className="modal-button">
              Log In
            </button>
            <button type="button" className="modal-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
