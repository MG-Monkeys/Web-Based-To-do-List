import happyMonkey from "../assets/happy-monkey.png";

export default function NavBar({
  onLoginClick,
  onLogoutClick,
  onColorClick,
  Colors,
  authUser, 
  onInboxClick,
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
        onClick={onInboxClick}
        style={{ backgroundColor: Colors.tertiary, color: Colors.tertiaryText }}
      >
        <i
          className="fa-solid fa-solid fa-envelope nav-icon"
          style={{
            color: Colors.tertiaryText,
          }}
        />
      </button>

      <button
        className="login-button"
        onClick={authUser ? onLogoutClick : onLoginClick}
        style={{ backgroundColor: Colors.tertiary, color: Colors.tertiaryText }}
      >
        {authUser ? (
          `Log Out (${authUser.user.username})`
        ) : (
      <div className="nav-left">
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
        <img
          src={happyMonkey}
          alt="monkey"
          className="nav-monkey"
        />
      </div>
      <div className="nav-name">
        <p>Monkey See Monkey Do</p>
      </div>
      <div className="nav-right">
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
      </div>
    </nav>
  );
}
