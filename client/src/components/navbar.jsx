export default function NavBar({ onLoginClick }) {
  return (
    <nav className="navbar">
      <div className="nav-spacer" />
      <div className="nav-name">
        <p>Monkey See Monkey Do</p>
      </div>
      <button className="login-button" onClick={onLoginClick}>
        Log In
      </button>
    </nav>
  );
}
