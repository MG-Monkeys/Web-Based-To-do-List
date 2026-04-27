import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import GroupModal from "../../components/groupModal";

describe("GroupModal integration", () => {
  test("creates a group and updates list", async () => {
    const setUserGroups = jest.fn();
    const onClose = jest.fn();

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          group: { _id: "g1", groupName: "Team Rocket", ownerId: "u1" },
        }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "u2", username: "friend" }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    render(
      <GroupModal
        isOpen={true}
        onClose={onClose}
        Colors={{}}
        authUser={{ user: { id: "u1", username: "owner" } }}
        setUserGroups={setUserGroups}
      />,
    );

    fireEvent.change(screen.getByLabelText(/Name:/i), {
      target: { value: "Team Rocket" },
    });
    fireEvent.change(screen.getByLabelText(/Users to Invite:/i), {
      target: { value: "friend" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Save/i }));

    await waitFor(() => {
      expect(setUserGroups).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
