import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Chat from "../../components/chat";

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>,
}));

function ChatHarness() {
  const [chatList, setChatList] = require("react").useState([
    { from: "assistant", message: "How can I help you?" },
  ]);

  return <Chat chatList={chatList} setChatList={setChatList} Colors={{}} />;
}

describe("Chat integration", () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  test("opens chat and sends message", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ response: "Try adding tags." }),
    });

    render(<ChatHarness />);

    fireEvent.click(screen.getByRole("button"));

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Help me plan" },
    });
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/ai/chat", expect.any(Object));
    });

    expect(await screen.findByText("Try adding tags.")).toBeInTheDocument();
  });
});
