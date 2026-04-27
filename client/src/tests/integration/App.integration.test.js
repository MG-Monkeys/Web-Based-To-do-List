import { fireEvent, render, screen } from "@testing-library/react";
import App from "../../App";

jest.mock("../../components/navbar", () => (props) => (
  <div>
    <button onClick={props.onLoginClick}>Open Login</button>
    <button onClick={props.onLogoutClick}>Log Out</button>
    <div>{props.authUser ? "authed" : "guest"}</div>
  </div>
));

jest.mock("../../components/calendar", () => () => <div>Calendar Section</div>);
jest.mock("../../components/taskModal", () => () => <div>Task Modal</div>);
jest.mock("../../components/list", () => () => <div>Task List</div>);
jest.mock("../../components/loginModal", () => (props) => (
  <div>{props.isOpen ? "Login Open" : "Login Closed"}</div>
));
jest.mock("../../components/inboxModal", () => () => <div>Inbox Modal</div>);
jest.mock("../../components/colorModal", () => () => <div>Color Modal</div>);
jest.mock("../../components/groupList", () => () => <div>Group List</div>);
jest.mock("../../components/chat", () => () => <div>Chat</div>);
jest.mock("../../components/groupModal", () => () => <div>Group Modal</div>);
jest.mock("../../components/monkeyCelebration", () => () => <div>Celebration</div>);
jest.mock("../../utils/eventUtil", () => ({ deleteTask: jest.fn() }));

describe("App integration", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => [],
    });
    localStorage.clear();
  });

  test("renders key sections", () => {
    render(<App />);

    expect(screen.getByText("Calendar Section")).toBeInTheDocument();
    expect(screen.getByText("Task List")).toBeInTheDocument();
    expect(screen.getByText("guest")).toBeInTheDocument();
  });

  test("opens login modal from navbar action", () => {
    render(<App />);

    expect(screen.getByText("Login Closed")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Open Login/i }));
    expect(screen.getByText("Login Open")).toBeInTheDocument();
  });
});
