// src/pages/api/messages/get.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { senderId, receiverId } = req.query;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: parseInt(senderId), receiverId: parseInt(receiverId) },
          { senderId: parseInt(receiverId), receiverId: parseInt(senderId) },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ error: "Error fetching messages", detail: err.message });
  }
}
