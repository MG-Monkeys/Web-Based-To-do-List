export default function NavBar({ onLoginClick, onColorClick, Colors }) {
  return (
    <nav
      className="navbar"
      style={{ backgroundColor: Colors.secondary, color: Colors.secondaryText }}
    >
      <button
        className="color-button"
        onClick={onColorClick}
        style={{ backgroundColor: Colors.tertiary, color: Colors.tertiaryText }}
      >
        Edit Colors
      </button>
      <div className="nav-name">
        <p>Monkey See Monkey Do</p>
      </div>
      <button
        className="login-button"
        onClick={onLoginClick}
        style={{ backgroundColor: Colors.tertiary, color: Colors.tertiaryText }}
      >
        Log In
      </button>
    </nav>
  );
}
