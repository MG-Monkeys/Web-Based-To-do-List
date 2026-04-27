import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginModal from "../../components/loginModal";

const colors = {
  primary: "#fff",
  primaryText: "#000",
  tertiary: "#ddd",
};

describe("LoginModal integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("signup flow stores user and calls callbacks", async () => {
    const onAuthSuccess = jest.fn();
    const onClose = jest.fn();

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        user: { id: "u1", username: "danny", email: "danny@example.com" },
      }),
    });

    render(
      <LoginModal
        isOpen={true}
        onClose={onClose}
        Colors={colors}
        onAuthSuccess={onAuthSuccess}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    fireEvent.change(screen.getByPlaceholderText("username"), {
      target: { value: "danny" },
    });
    fireEvent.change(screen.getByPlaceholderText("example@email.com"), {
      target: { value: "danny@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password:/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    await waitFor(() => {
      expect(onAuthSuccess).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    expect(localStorage.getItem("id")).toBe("u1");
    expect(localStorage.getItem("user")).toBe("danny");
    expect(localStorage.getItem("email")).toBe("danny@example.com");
  });

  test("shows error when login fails", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Invalid credentials" }),
    });

    render(
      <LoginModal
        isOpen={true}
        onClose={jest.fn()}
        Colors={colors}
        onAuthSuccess={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("example@email.com"), {
      target: { value: "danny@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password:/i), {
      target: { value: "bad-password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^Log In$/i }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });
});
