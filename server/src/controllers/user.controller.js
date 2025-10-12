import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// GET /api/users?page=&pageSize=&q=&role=
export async function listUsers(req, res) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 12));
  const q = (req.query.q || '').toString().trim();
  const role = (req.query.role || '').toString().trim().toUpperCase();

  const where = {
    ...(q
      ? {
          OR: [{ name: { contains: q } }, { email: { contains: q } }],
        }
      : {}),
    ...(role === 'USER' || role === 'ADMIN' ? { role } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  res.json({
    items,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  });
}

// GET /api/users/:id
export async function getUserById(req, res) {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}

// PATCH /api/users/:id/role  body: { role: 'USER' | 'ADMIN' }
export async function updateUserRole(req, res) {
  const id = Number(req.params.id);
  const { role } = req.body;
  if (!['USER', 'ADMIN'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    });
    res.json(user);
  } catch (e) {
    if (e.code === 'P2025')
      return res.status(404).json({ message: 'User not found' });
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
}
