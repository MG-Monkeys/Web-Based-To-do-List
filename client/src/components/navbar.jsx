export default function NavBar({
  onLoginClick,
  onLogoutClick,
  onColorClick,
  Colors,
  authUser,
}) {
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
        onClick={authUser ? onLogoutClick : onLoginClick}
        style={{ backgroundColor: Colors.tertiary, color: Colors.tertiaryText }}
      >
        {authUser ? `Log Out (${authUser.username})` : "Log In / Sign Up"}
      </button>
    </nav>
  );
}
