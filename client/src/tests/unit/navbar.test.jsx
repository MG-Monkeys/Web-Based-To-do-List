import { fireEvent, render, screen } from "@testing-library/react";
import NavBar from "../../components/navbar";

const colors = {
  secondary: "#fff",
  secondaryText: "#000",
  tertiary: "#eee",
  tertiaryText: "#111",
};

describe("NavBar", () => {
  test("shows logout text for authenticated user", () => {
    render(
      <NavBar
        onLoginClick={jest.fn()}
        onLogoutClick={jest.fn()}
        onColorClick={jest.fn()}
        Colors={colors}
        authUser={{ user: { username: "Danny" } }}
        onInboxClick={jest.fn()}
      />,
    );

    expect(screen.getByText("Log Out (Danny)")).toBeInTheDocument();
  });

  test("clicking auth button triggers login when unauthenticated", () => {
    const onLoginClick = jest.fn();

    render(
      <NavBar
        onLoginClick={onLoginClick}
        onLogoutClick={jest.fn()}
        onColorClick={jest.fn()}
        Colors={colors}
        authUser={null}
        onInboxClick={jest.fn()}
      />,
    );

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[2]);

    expect(onLoginClick).toHaveBeenCalledTimes(1);
  });
});
