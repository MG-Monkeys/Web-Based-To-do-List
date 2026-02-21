export default function NavBar({ onLoginClick, onColorClick, Colors }) {
  return (
    <nav className="navbar" style={{ backgroundColor: Colors.secondary }}>
      <button
        className="color-button"
        onClick={onColorClick}
        style={{ backgroundColor: Colors.tertiary }}
      >
        Edit Colors
      </button>
      <div className="nav-name">
        <p>Monkey See Monkey Do</p>
      </div>
      <button
        className="login-button"
        onClick={onLoginClick}
        style={{ backgroundColor: Colors.tertiary }}
      >
        Log In
      </button>
    </nav>
  );
}
