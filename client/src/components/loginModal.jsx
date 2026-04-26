import { useState } from "react";

export default function LoginModal({ isOpen, onClose, Colors, onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formJson = Object.fromEntries(formData.entries());

    setStatus({ type: "", message: "" });
    setIsSubmitting(true);

    const endpoint = mode === "signup" ? "/users/signup" : "/auth/login";
    const payload =
      mode === "signup"
        ? {
            username: formJson.username?.trim(),
            email: formJson.email?.trim(),
            password: formJson.password,
          }
        : {
            email: formJson.email?.trim(),
            password: formJson.password,
          };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Request failed");
      }
      
      localStorage.setItem("id", data.user.id);
      localStorage.setItem("user", data.user.username);
      localStorage.setItem("email", data.user.email);

      setStatus({
        type: "success",
        message: mode === "signup" ? "Account created." : "Logged in.",
      });
      onAuthSuccess(data);
      onClose();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: Colors.primary, color: Colors.primaryText }}
      >
        {mode === "signup" ? (
          <>
            Sign Up
            <div className="auth-toggle-row">
              Already have an account?
              <button
                type="button"
                className="modal-button"
                onClick={() => setMode("login")}
                disabled={isSubmitting}
                style={{ backgroundColor: Colors.tertiary }}
              >
                Log In
              </button>
            </div>
          </>
        ) : (
          <>
            Log In
            <div className="auth-toggle-row">
              Don't have an account?
              <button
                type="button"
                className="modal-button"
                onClick={() => setMode("signup")}
                disabled={isSubmitting}
                style={{ backgroundColor: Colors.tertiary }}
              >
                Sign Up
              </button>
            </div>
          </>
        )}
        <form onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <label>
              Username:
              <input
                type="text"
                placeholder="username"
                name="username"
                required
              />
            </label>
          ) : null}
          <label>
            Email:
            <input
              type="email"
              placeholder="example@email.com"
              name="email"
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              minLength={mode === "signup" ? 8 : undefined}
              required
            />
          </label>
          {status.message ? (
            <p className={`auth-message ${status.type}`}>{status.message}</p>
          ) : null}
          <div>
            <button
              type="submit"
              className="modal-button"
              disabled={isSubmitting}
              style={{ backgroundColor: Colors.tertiary }}
            >
              {isSubmitting
                ? "Please wait..."
                : mode === "signup"
                  ? "Create Account"
                  : "Log In"}
            </button>
            <button
              type="button"
              className="modal-button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{ backgroundColor: Colors.tertiary }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
