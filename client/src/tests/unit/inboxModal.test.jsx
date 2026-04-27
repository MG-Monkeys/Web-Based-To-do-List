import { render, screen } from "@testing-library/react";
import InboxModal from "../../components/inboxModal";

const Colors = {
  primary: "#fff",
  primaryText: "#000",
};

describe("InboxModal", () => {
  test("does not render when closed", () => {
    const { container } = render(
      <InboxModal
        isOpen={false}
        onClose={jest.fn()}
        Colors={Colors}
        User={null}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("shows sign-in prompt when opened without user", () => {
    render(
      <InboxModal
        isOpen={true}
        onClose={jest.fn()}
        Colors={Colors}
        User={null}
      />,
    );

    expect(screen.getByText(/Sign in to get invites/i)).toBeInTheDocument();
  });
});
