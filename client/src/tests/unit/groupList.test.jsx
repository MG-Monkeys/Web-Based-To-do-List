import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import GroupList from "../../components/groupList";

describe("GroupList", () => {
  test("renders sign-in prompt when no user", () => {
    render(
      <GroupList
        User={null}
        userGroups={[]}
        setUserGroups={jest.fn()}
        selectedGroups={[]}
        setSelectedGroups={jest.fn()}
      />,
    );

    expect(screen.getByText(/Sign in to join and create groups/i)).toBeInTheDocument();
  });

  test("fetches and renders groups for user", async () => {
    const setUserGroups = jest.fn();

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ groups: [{ id: "g1" }] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _id: "g1", groupName: "Team Alpha" }),
      });

    render(
      <GroupList
        User={{ user: { id: "u1" } }}
        userGroups={[{ _id: "g1", groupName: "Team Alpha" }]}
        setUserGroups={setUserGroups}
        selectedGroups={[]}
        setSelectedGroups={jest.fn()}
      />,
    );

    await waitFor(() => {
      expect(setUserGroups).toHaveBeenCalledWith([
        { _id: "g1", groupName: "Team Alpha" },
      ]);
    });

    expect(screen.getByText("Team Alpha")).toBeInTheDocument();
  });

  test("updates selected groups when checkbox changes", () => {
    const setSelectedGroups = jest.fn();

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ groups: [{ id: "g1" }] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _id: "g1", groupName: "Team Alpha" }),
      });

    render(
      <GroupList
        User={{ user: { id: "u1" } }}
        userGroups={[{ _id: "g1", groupName: "Team Alpha" }]}
        setUserGroups={jest.fn()}
        selectedGroups={[]}
        setSelectedGroups={setSelectedGroups}
      />,
    );

    fireEvent.click(screen.getByRole("checkbox"));
    expect(setSelectedGroups).toHaveBeenCalledTimes(1);
  });
});
