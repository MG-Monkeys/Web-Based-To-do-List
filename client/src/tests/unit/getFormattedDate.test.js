import getFormattedDate from "../../utils/getFormattedDate";

describe("getFormattedDate", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test("returns yyyy-mm-dd with zero padding", () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 3, 9, 12, 0, 0));
    expect(getFormattedDate()).toBe("2026-04-09");
  });
});
