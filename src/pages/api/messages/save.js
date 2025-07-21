import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { senderId, receiverId, content } = req.body;
  console.log("Message Payload:", { senderId, receiverId, content });

  if (!senderId || !receiverId || !content) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const message = await prisma.message.create({
      data: {
        senderId: parseInt(senderId),
        receiverId: parseInt(receiverId),
        content,
      },
    });

    // ✅ This return is mandatory!
    return res.status(201).json({ message });
  } catch (err) {
    console.error("Error saving message:", err);
    return res.status(500).json({ error: "Error saving message", detail: err.message });
  }
}
