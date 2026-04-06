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
        <i
          className="fa-solid fa-gear nav-icon"
          style={{
            color: Colors.tertiaryText,
          }}
        />
      </button>
      <div className="nav-name">
        <p>Monkey See Monkey Do</p>
      </div>
      <button
        className="login-button"
        onClick={authUser ? onLogoutClick : onLoginClick}
        style={{ backgroundColor: Colors.tertiary, color: Colors.tertiaryText }}
      >
        {authUser ? (
          `Log Out (${authUser.username})`
        ) : (
          <i
            className="fa-solid fa-user-circle nav-icon"
            style={{
              color: Colors.tertiaryText,
            }}
          />
        )}
      </button>
    </nav>
  );
}
