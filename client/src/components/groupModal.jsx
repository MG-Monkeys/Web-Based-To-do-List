export default function GroupModal({ isOpen, onClose, Colors, authUser }) {
  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formJson = Object.fromEntries(formData.entries());

    const response = await fetch("/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        groupName: formJson.name,
        ownerId: authUser.user.id,
      }),
    });

    if (!response.ok) {
      console.error("Failed to create group");
      return;
    }

    const data = await response.json();
    const groupId = data.group._id;
    const toInvite = formJson.toInvite.split(",");

    for (const username of toInvite) {
      const userResponse = await fetch(`/users/username/${username.trim()}`, {
        method: "GET",
      });
      const userData = await userResponse.json();

      if (!userResponse.ok) {
        console.log(`User "${username.trim()}" not found`);
        continue;
      }

      await fetch("/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: authUser.user.username,
          senderId: authUser?.user.id,
          recipientId: userData.id,
          groupName: formJson.name,
          groupId,
        }),
      });
      await fetch("/users/acceptInvite/"+authUser?.user.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groups : {id: groupId, name: formJson.name},
        }),
      });
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p>Create A Group:</p>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" />
          </label>
          <label>
            Users to Invite:
            <input type="text" name="toInvite" />
          </label>
          <button type="submit" className="modal-button">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
