import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import {
  signToken,
  setAuthCookie,
  clearAuthCookie,
} from '../middleware/auth.js';

const prisma = new PrismaClient();

// POST /api/auth/register
export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Name, email and password are required' });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
      return res.status(409).json({ message: 'Email already in use' });

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
        role: role === 'ADMIN' ? 'ADMIN' : 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // auto-login nakon registracije
    const token = signToken({ id: user.id, role: user.role });
    setAuthCookie(res, token);

    return res.status(201).json({ user, token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/auth/login
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: 'Email and password are required' });

    const userFound = await prisma.user.findUnique({ where: { email } });
    if (!userFound)
      return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, userFound.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const user = {
      id: userFound.id,
      name: userFound.name,
      email: userFound.email,
      role: userFound.role,
      createdAt: userFound.createdAt,
    };
    const token = signToken({ id: user.id, role: user.role });
    setAuthCookie(res, token);

    return res.json({ user, token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/auth/logout
export async function logout(_req, res) {
  try {
    clearAuthCookie(res);
    return res.json({ message: 'Logged out' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/auth/me
export async function me(req, res) {
  // req.user postavlja requireAuth middleware
  return res.json(req.user);
}
