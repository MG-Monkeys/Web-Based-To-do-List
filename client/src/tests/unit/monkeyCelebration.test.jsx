import { act, render, screen } from "@testing-library/react";
import MonkeyCelebration from "../../components/monkeyCelebration";

describe("MonkeyCelebration", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("calls onDone after animation completes", () => {
    const onDone = jest.fn();
    render(<MonkeyCelebration onDone={onDone} />);

    act(() => {
      jest.advanceTimersByTime(4800);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  test("shows bang text during shoot phase", () => {
    render(<MonkeyCelebration onDone={jest.fn()} />);

    act(() => {
      jest.advanceTimersByTime(650);
    });
    expect(screen.getByText("BAAANG!")).toBeInTheDocument();
  });
});
