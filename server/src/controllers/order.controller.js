import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const ORDER_SELECT = {
  id: true,
  orderNumber: true,
  status: true,
  total: true,
  currency: true,
  shippingName: true,
  shippingAddress1: true,
  shippingAddress2: true,
  shippingCity: true,
  shippingZip: true,
  shippingCountry: true,
  note: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  items: {
    select: {
      id: true,
      productId: true,
      name: true,
      price: true,
      quantity: true,
      imageUrl: true,
      createdAt: true,
    },
  },
};

function generateOrderNumber() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  const year = new Date().getFullYear();
  return `VEL-${year}-${rand}`;
}

// POST /api/orders  (AUTH)
export async function createOrder(req, res) {
  try {
    const userId = req.user.id;
    const {
      items, // [{ productId, quantity }]
      shippingName,
      shippingAddress1,
      shippingAddress2,
      shippingCity,
      shippingZip,
      shippingCountry,
      note,
      currency = 'EUR',
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }
    if (
      !shippingName ||
      !shippingAddress1 ||
      !shippingCity ||
      !shippingZip ||
      !shippingCountry
    ) {
      return res
        .status(400)
        .json({ message: 'Shipping information is incomplete' });
    }

    // Učitamo sve proizvode iz zahteva
    const productIds = items.map((i) => Number(i.productId)).filter(Boolean);
    if (productIds.length !== items.length) {
      return res.status(400).json({ message: 'Invalid productId in items' });
    }
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        imageUrl: true,
        isActive: true,
      },
    });

    // validacija: svaki item mora imati aktivan proizvod, dovoljan stock i quantity >=1
    const productMap = new Map(products.map((p) => [p.id, p]));
    for (const it of items) {
      const qty = Number(it.quantity);
      if (!qty || qty < 1) {
        return res
          .status(400)
          .json({ message: 'Each item must have quantity >= 1' });
      }
      const prod = productMap.get(Number(it.productId));
      if (!prod || !prod.isActive) {
        return res
          .status(400)
          .json({ message: `Product ${it.productId} not available` });
      }
      if (prod.stock < qty) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for product ${prod.name}` });
      }
    }

    // izračunaj total iz snapshot cena
    const total = items.reduce((sum, it) => {
      const prod = productMap.get(Number(it.productId));
      return sum + Number(prod.price) * Number(it.quantity);
    }, 0);

    const orderNumber = generateOrderNumber();

    // Transakcija: kreiraj order, stavke, smanji stock
    const created = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          orderNumber,
          status: 'PENDING',
          total,
          currency,
          shippingName,
          shippingAddress1,
          shippingAddress2: shippingAddress2 || null,
          shippingCity,
          shippingZip,
          shippingCountry,
          note: note || null,
        },
        select: { id: true },
      });

      // kreiraj snapshot stavke
      await tx.orderItem.createMany({
        data: items.map((it) => {
          const p = productMap.get(Number(it.productId));
          return {
            orderId: order.id,
            productId: p.id,
            name: p.name,
            price: p.price,
            quantity: Number(it.quantity),
            imageUrl: p.imageUrl || null,
          };
        }),
      });

      // smanji stock
      for (const it of items) {
        await tx.product.update({
          where: { id: Number(it.productId) },
          data: { stock: { decrement: Number(it.quantity) } },
        });
      }

      // vrati kompletne detalje
      return tx.order.findUnique({
        where: { id: order.id },
        select: ORDER_SELECT,
      });
    });

    return res.status(201).json(created);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/orders  (AUTH; admin vidi sve, user vidi svoje)
export async function listOrders(req, res) {
  try {
    const isAdmin = req.user.role === 'ADMIN';
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(
      50,
      Math.max(1, Number(req.query.pageSize) || 12)
    );
    const status = (req.query.status || '').toString().trim();
    const userIdFilter = Number(req.query.userId || 0);

    const where = {
      ...(isAdmin ? {} : { userId: req.user.id }),
      ...(status ? { status } : {}),
      ...(isAdmin && userIdFilter ? { userId: userIdFilter } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: ORDER_SELECT,
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      items,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/orders/:id  (AUTH; owner ili admin)
export async function getOrder(req, res) {
  try {
    const id = Number(req.params.id);
    const order = await prisma.order.findUnique({
      where: { id },
      select: ORDER_SELECT,
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOwner = order.userId === req.user.id;
    if (!isOwner && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    return res.json(order);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
}

// PATCH /api/orders/:id/status  (ADMIN)
export async function updateOrderStatus(req, res) {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const allowed = new Set([
      'PENDING',
      'PAID',
      'SHIPPED',
      'DELIVERED',
      'CANCELED',
    ]);
    if (!allowed.has(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      select: ORDER_SELECT,
    });

    return res.json(updated);
  } catch (e) {
    if (e.code === 'P2025')
      return res.status(404).json({ message: 'Order not found' });
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/orders/:id/cancel  (AUTH; owner može otkazati PENDING → vrati stock)
export async function cancelMyOrder(req, res) {
  try {
    const id = Number(req.params.id);
    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        status: true,
        items: { select: { productId: true, quantity: true } },
      },
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (order.status !== 'PENDING') {
      return res
        .status(400)
        .json({ message: 'Only PENDING orders can be canceled' });
    }

    const updated = await prisma.$transaction(async (tx) => {
      // vrati stock
      for (const it of order.items) {
        await tx.product.update({
          where: { id: it.productId },
          data: { stock: { increment: it.quantity } },
        });
      }
      // postavi status
      return tx.order.update({
        where: { id: order.id },
        data: { status: 'CANCELED' },
        select: ORDER_SELECT,
      });
    });

    return res.json(updated);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
}
