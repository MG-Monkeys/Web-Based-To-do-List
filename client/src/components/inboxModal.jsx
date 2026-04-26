import { useState, useEffect } from "react";

export default function InboxModal({ isOpen, onClose, Colors, User}) {
  const [invitesList, setInvitesList] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function getInvites() {
    try {
      const response = await fetch(`invites/${User?.user.id}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Could not fetch invites");
      }
      console.log("Fetched invites: ", data);
      setInvitesList(data);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } 
  }

  useEffect(() => {
    if (!User) {
      return;
    }
    getInvites();
  }, [User]);
  
  if (!isOpen) return null;

    async function handleAccept(inviteId, id, name) {
      try {
        await fetch(`/users/acceptInvite/${User?.user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            groups : {id: id, name: name},
            inviteId: inviteId,
          }),
        });
        await fetch(`/invites/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
        });
        getInvites();
      } catch (error) {
        setStatus({ type: "error", message: error.message });
      }
    }

  async function handleDecline(id) {
    try {
      await fetch(`/invites/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      getInvites();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  }

  if (!User) return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: Colors.primary, color: Colors.primaryText }}
      >
      <h2>Group Invite Inbox<hr></hr></h2>

      <div className="inbox-content">
        <p><strong>Sign in to get invites</strong></p>
      </div>
      </div>
    </div>
  );

  if(!invitesList || invitesList === 0) return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: Colors.primary, color: Colors.primaryText }}
      >
      <h2>Group Invite Inbox<hr></hr></h2>
      <div className="inbox-content"><p><strong>Empty</strong></p></div>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: Colors.primary, color: Colors.primaryText }}
      >
      <h2>Group Invite Inbox<hr></hr></h2>

      <div className="inbox-content">
        {invitesList.map((invite) => (

          <div key={invite._id} className="auth-toggle-row" style={{ backgroundColor: Colors.primary, color: Colors.primaryText }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p><strong>{invite.groupName}</strong></p>
              <p>{invite.senderName}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <button
                type="button"
                className="modal-button"
                style={{width: "100%"}}
                onClick={() => handleAccept(invite._id, invite.groupId, invite.groupName)}
                disabled={isSubmitting}
              > Accept </button>

              <button
                type="button"
                className="modal-button"
                style={{width: "100%"}}
                onClick={() => handleDecline(invite._id)}
                disabled={isSubmitting}
              > Decline </button>
            </div>
          </div>
          ))}
        </div>
      </div>
    </div>
  );
}
