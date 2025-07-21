import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// Simulate current user (Replace this later with real auth)
const CURRENT_USER_ID = 1;
const RECEIVER_ID = 2;

let socket;

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const socketInitialized = useRef(false);

  // ✅ Load previous messages
  useEffect(() => {
    async function fetchMessages() {
      const res = await fetch(`/api/messages/get?senderId=${CURRENT_USER_ID}&receiverId=${RECEIVER_ID}`);
      const data = await res.json();
      if (res.ok) setChat(data.messages.map((msg) => msg.content));
    }

    fetchMessages();
  }, []);

  // ✅ Socket connection
  useEffect(() => {
    if (!socketInitialized.current) {
      fetch("/api/socket"); // Start server
      socket = io(undefined, { path: "/api/socket" });

      socket.on("receive-message", (msg) => {
        setChat((prev) => [...prev, msg.content]);
      });

      socketInitialized.current = true;
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  // ✅ Send message
  const sendMessage = async () => {
    if (!message) return;

    const payload = {
      senderId: CURRENT_USER_ID,
      receiverId: RECEIVER_ID,
      content: message,
    };

    // Save to DB
    await fetch("/api/messages/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Emit via socket
    socket.emit("send-message", payload);

    // Show immediately in UI
    setChat((prev) => [...prev, message]);
    setMessage("");
  };

  return (
    <div className="container mt-4">
      <h3>Chat with User {RECEIVER_ID}</h3>
      <ul className="list-group mb-3">
        {chat.map((msg, idx) => (
          <li key={idx} className="list-group-item">{msg}</li>
        ))}
      </ul>

      <div className="input-group">
        <input
          className="form-control"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage} className="btn btn-primary">Send</button>
      </div>
    </div>
  );
}
