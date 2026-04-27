import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import TaskModal from "../../components/taskModal";

jest.mock("../../utils/eventUtil", () => ({
  deleteTask: jest.fn(),
}));

const baseProps = {
  isOpen: true,
  onClose: jest.fn(),
  setTasks: jest.fn(),
  toCalendarTask: jest.fn(),
  onRemoveTask: jest.fn(),
  groupList: [{ _id: "g1", groupName: "Group One" }],
  Colors: { primary: "#fff", text: "#000", tertiary: "#ddd" },
  setTaskData: jest.fn(),
  onAddTask: jest.fn().mockResolvedValue(undefined),
  onUpdateTask: jest.fn().mockResolvedValue(undefined),
};

describe("TaskModal integration", () => {
  test("shows auth prompt when user is not logged in", () => {
    render(
      <TaskModal
        {...baseProps}
        authUser={null}
        taskData={{ title: "", date: "", tags: "", completed: false }}
      />,
    );

    expect(screen.getByText(/Please log in to manage tasks/i)).toBeInTheDocument();
  });

  test("creates a new task through onAddTask", async () => {
    const onAddTask = jest.fn().mockResolvedValue(undefined);
    const onClose = jest.fn();

    render(
      <TaskModal
        {...baseProps}
        onAddTask={onAddTask}
        onClose={onClose}
        authUser={{ user: { id: "u1" } }}
        taskData={{
          title: "Write tests",
          date: "2026-04-26",
          startTime: "09:00",
          endTime: "10:00",
          allDay: false,
          reoccurrence: "none",
          completed: false,
          description: "Add frontend test coverage",
          tags: "QA, Frontend",
          groupId: "none",
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /^Add$/i }));

    await waitFor(() => {
      expect(onAddTask).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    const payload = onAddTask.mock.calls[0][0];
    expect(payload.title).toBe("Write tests");
    expect(payload.extendedProps.description).toBe("Add frontend test coverage");
    expect(payload.extendedProps.tags).toEqual(["QA", " Frontend"]);
  });
});
