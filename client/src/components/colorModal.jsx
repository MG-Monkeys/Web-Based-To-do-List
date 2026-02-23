export default function ColorModal({
  isOpen,
  onClose,
  onColorChange,
  primaryColor,
  secondaryColor,
  tertiaryColor,
  primaryText,
  secondaryText,
  tertiaryText,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: primaryColor, color: primaryText }}
      >
        <p>Choose Colors:</p>
        <div className="color-div">
          <table>
            <tbody>
              <tr>
                <td>
                  <label>
                    Primary Color:
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => onColorChange("primary", e.target.value)}
                    />
                  </label>
                </td>
                <td>
                  <label>
                    Text:
                    <input
                      type="color"
                      value={primaryText}
                      onChange={(e) =>
                        onColorChange("primaryText", e.target.value)
                      }
                    />
                  </label>
                </td>
              </tr>
              <tr>
                <td>
                  <label>
                    Secondary Color:
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) =>
                        onColorChange("secondary", e.target.value)
                      }
                    />
                  </label>
                </td>
                <td>
                  <label>
                    Text:
                    <input
                      type="color"
                      value={secondaryText}
                      onChange={(e) =>
                        onColorChange("secondaryText", e.target.value)
                      }
                    />
                  </label>
                </td>
              </tr>
              <tr>
                <td>
                  <label>
                    Tertiary Color:
                    <input
                      type="color"
                      value={tertiaryColor}
                      onChange={(e) =>
                        onColorChange("tertiary", e.target.value)
                      }
                    />
                  </label>
                </td>
                <td>
                  <label>
                    Text:
                    <input
                      type="color"
                      value={tertiaryText}
                      onChange={(e) =>
                        onColorChange("tertiaryText", e.target.value)
                      }
                    />
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
          <button type="button" className="modal-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
