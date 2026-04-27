import { fireEvent, render, screen } from "@testing-library/react";
import ColorModal from "../../components/colorModal";

describe("ColorModal", () => {
  const props = {
    onClose: jest.fn(),
    onColorChange: jest.fn(),
    primaryColor: "#ffffff",
    secondaryColor: "#cccccc",
    tertiaryColor: "#999999",
    primaryText: "#000000",
    secondaryText: "#111111",
    tertiaryText: "#222222",
  };

  test("does not render when closed", () => {
    const { container } = render(<ColorModal isOpen={false} {...props} />);
    expect(container).toBeEmptyDOMElement();
  });

  test("calls onColorChange for primary color", () => {
    render(<ColorModal isOpen={true} {...props} />);

    fireEvent.change(screen.getByLabelText(/Primary Color:/i), {
      target: { value: "#123456" },
    });

    expect(props.onColorChange).toHaveBeenCalledWith("primary", "#123456");
  });

  test("closes when close button is clicked", () => {
    render(<ColorModal isOpen={true} {...props} />);

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });
});
