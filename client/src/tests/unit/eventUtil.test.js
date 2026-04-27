import { deleteTask, handleEventClick } from "../../utils/eventUtil";

describe("eventUtil", () => {
  test("handleEventClick maps FullCalendar click data", () => {
    const clickInfo = {
      event: {
        id: "t1",
        title: "Task",
        start: "2026-04-26T09:00:00.000Z",
        startStr: "2026-04-26T09:00:00",
        endStr: "2026-04-26T10:30:00",
        allDay: false,
        extendedProps: {
          reoccurrence: "none",
          description: "desc",
          tags: ["Work"],
          completed: false,
          groupId: "g1",
        },
      },
    };

    expect(handleEventClick(clickInfo)).toEqual({
      id: "t1",
      title: "Task",
      start: "2026-04-26T09:00:00.000Z",
      date: "2026-04-26",
      startTime: "09:00",
      endTime: "10:30",
      allDay: false,
      reoccurrence: "none",
      description: "desc",
      tags: ["Work"],
      completed: false,
      groupId: "g1",
    });
  });

  test("deleteTask calls delete endpoint", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true });

    await deleteTask("abc123");

    expect(global.fetch).toHaveBeenCalledWith("/tasks/abc123", {
      method: "DELETE",
    });
  });

  test("deleteTask throws when request fails", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false });

    await expect(deleteTask("abc123")).rejects.toThrow("Failed to delete task");
  });
});
