import { useState } from "react";

export default function InboxModal({ isOpen, onClose, Colors, }) {
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleAccept(e) {
    e.preventDefault();
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

  async function handleDecline(e) {
    e.preventDefault();
    console.log("declined invite");
  }


  // try {
  //   const response = await fetch("invites/", {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload),
  //   });

  //   const data = await response.json();
  //   if (!response.ok) {
  //     throw new Error(data?.error || "Request failed");
  //   }

  //   setStatus({
  //     type: "success",
  //     message: "Invites gotten",
  //   });
  // } catch (error) {
  //   setStatus({ type: "error", message: error.message });
  // } 


  // // <div className="auth-toggle-row" style={{ backgroundColor: Colors.primary, color: Colors.primaryText }}>
  //         <p><strong>From:</strong> Alice</p>
  //         <button
  //           type="button"
  //           className="modal-button"
  //           onClick={() => setMode("login")}
  //           disabled={isSubmitting}
  //         >
  //           Accept
  //         </button>
  //         <button
  //           type="button"
  //           className="modal-button"
  //           onClick={() => setMode("login")}
  //           disabled={isSubmitting}
  //         >
  //           Decline
  //         </button>
  //       </div>




  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: Colors.primary, color: Colors.primaryText }}
      >

      <h2>
        Group Invite Inbox
        <hr></hr>
      </h2>

      <div className="inbox-content">
        <p><strong>Empty</strong></p>
      </div>
      </div>
    </div>
  );
}
