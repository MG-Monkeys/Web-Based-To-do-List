import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./components/navbar", () => () => <div>Mock NavBar</div>);
jest.mock("./components/calendar", () => () => <div>Mock Calendar</div>);
jest.mock("./components/taskModal", () => () => <div>Mock Task Modal</div>);
jest.mock("./components/list", () => () => <div>Mock Task List</div>);
jest.mock("./components/loginModal", () => () => <div>Mock Login Modal</div>);
jest.mock("./components/inboxModal", () => () => <div>Mock Inbox Modal</div>);
jest.mock("./components/colorModal", () => () => <div>Mock Color Modal</div>);
jest.mock("./components/groupList", () => () => <div>Mock Group List</div>);
jest.mock("./components/chat", () => () => <div>Mock Chat</div>);
jest.mock("./components/groupModal", () => () => <div>Mock Group Modal</div>);
jest.mock("./components/monkeyCelebration", () => () => (
  <div>Mock Celebration</div>
));
jest.mock("./utils/eventUtil", () => ({ deleteTask: jest.fn() }));

test("renders app shell", () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status: 404,
    json: async () => [],
  });

  render(<App />);
  expect(screen.getByText("Mock NavBar")).toBeInTheDocument();
  expect(screen.getByText("Mock Calendar")).toBeInTheDocument();
  expect(screen.getByText("Mock Task List")).toBeInTheDocument();
});
