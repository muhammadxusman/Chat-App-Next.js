// src/pages/chat.js
import dynamic from "next/dynamic";

// ✅ Disable SSR because sockets only work in browser
const ChatPage = dynamic(() => import("../components/ChatPage"), { ssr: false });

export default function ChatRoute() {
  return <ChatPage />;
}
