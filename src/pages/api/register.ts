// pages/api/register.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return res.status(201).json({ message: "User registered", user: { id: newUser.id, name, email } });
  } catch (error) {
    return res.status(500).json({ message: "Error registering user", error });
  }
}
