import { useState, useEffect } from "react";

export default function InboxModal({ isOpen, onClose, Colors, User}) {
  const [invitesList, setInvitesList] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!User) {
      return;
    }

  async function getInvites() {
    try {
      const response = await fetch(`invites/${User.user.id}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Could not fetch invites");
      }
      console.log("DATA: " + JSON.stringify(data));
      setInvitesList(data);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } 
  }
  getInvites();

  }, [User]);
  
  if (!isOpen) return null;

    async function handleAccept() {
    console.log("accepted invite");

  //   try {
  //   const response = await fetch(endpoint, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload),
  //   });

  //   const data = await response.json();
  //   if (!response.ok) {
  //     throw new Error(data?.error || "Request failed");
  //   }

  //   setStatus({
  //     type: "success",
  //     message: "",
  //   });
  //   onAuthSuccess(data.user);
  //   onClose();
  // } catch (error) {
  //   setStatus({ type: "error", message: error.message });
  // } finally {
  //   setIsSubmitting(false);
  // }

  }

  async function handleDecline() {
    console.log("declined invite");
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

          <div className="auth-toggle-row" style={{ backgroundColor: Colors.primary, color: Colors.primaryText }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p><strong>{invite.groupName}</strong></p>
              <p>{invite.senderName}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <button
                type="button"
                className="modal-button"
                style={{width: "100%"}}
                onClick={() => handleAccept(invite)}
                disabled={isSubmitting}
              > Accept </button>

              <button
                type="button"
                className="modal-button"
                style={{width: "100%"}}
                onClick={() => handleDecline(invite)}
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
