export default function ColorModal({
  isOpen,
  onClose,
  onColorChange,
  primaryColor,
  secondaryColor,
  tertiaryColor,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p>Choose Colors:</p>
        <div>
          <label>
            Primary Color:
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => onColorChange("primary", e.target.value)}
            />
          </label>
          <label>
            Secondary Color:
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => onColorChange("secondary", e.target.value)}
            />
          </label>
          <label>
            Tertiary Color:
            <input
              type="color"
              value={tertiaryColor}
              onChange={(e) => onColorChange("tertiary", e.target.value)}
            />
          </label>
          <button type="button" className="modal-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
