import { PrismaClient } from '@prisma/client';
import { cloudinary } from '../config/cloudinary.js';
import streamifier from 'streamifier';

const prisma = new PrismaClient();

function uploadBufferToCloudinary(buffer, folder = 'velora/products') {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(upload);
  });
}

// POST /api/products  (ADMIN)
export async function createProduct(req, res) {
  try {
    const {
      name,
      description,
      price,
      currency = 'EUR',
      stock = 0,
      isActive = true,
      category = null,
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    let imageUrl = null;
    if (req.file) {
      const result = await uploadBufferToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: Number(price),
        currency,
        imageUrl,
        stock: Number(stock) || 0,
        isActive: Boolean(isActive),
        category: category || null,
      },
    });

    return res.status(201).json(product);
  } catch (e) {
    if (e.code === 'P2002' && e.meta?.target?.includes('name')) {
      return res.status(409).json({ message: 'Product name must be unique' });
    }
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
}

// PUT /api/products/:id  (ADMIN)
export async function updateProduct(req, res) {
  try {
    const id = Number(req.params.id);
    const { name, description, price, currency, stock, isActive, category } =
      req.body;

    let imageData = {};
    if (req.file) {
      const result = await uploadBufferToCloudinary(req.file.buffer);
      imageData.imageUrl = result.secure_url;
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(price !== undefined ? { price: Number(price) } : {}),
        ...(currency !== undefined ? { currency } : {}),
        ...(stock !== undefined ? { stock: Number(stock) } : {}),
        ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
        ...(category !== undefined ? { category: category || null } : {}), // NEW
        ...imageData,
      },
    });

    return res.json(product);
  } catch (e) {
    if (e.code === 'P2025')
      return res.status(404).json({ message: 'Product not found' });
    if (e.code === 'P2002' && e.meta?.target?.includes('name')) {
      return res.status(409).json({ message: 'Product name must be unique' });
    }
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
}

// DELETE /api/products/:id  (ADMIN)
export async function deleteProduct(req, res) {
  try {
    const id = Number(req.params.id);
    await prisma.product.delete({ where: { id } });
    return res.json({ message: 'Deleted' });
  } catch (e) {
    if (e.code === 'P2025')
      return res.status(404).json({ message: 'Product not found' });
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/products  (PUBLIC) — paginacija, pretraga, kategorija, sortiranje
export async function listProducts(req, res) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 12));

  const q = (req.query.q || '').toString().trim();
  const category = (req.query.category || '').toString().trim(); // NEW

  const sortBy = (req.query.sortBy || 'createdAt').toString();
  const order = (req.query.order || 'desc').toString().toLowerCase();

  const allowedSort = new Set(['createdAt', 'price', 'name']);
  const sortField = allowedSort.has(sortBy) ? sortBy : 'createdAt';
  const sortOrder = order === 'asc' ? 'asc' : 'desc';

  const where = {
    ...(q
      ? {
          OR: [{ name: { contains: q } }, { description: { contains: q } }],
        }
      : {}),
    ...(category ? { category } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { [sortField]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    items,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  });
}

// GET /api/products/:id  (PUBLIC)
export async function getProduct(req, res) {
  try {
    const id = Number(req.params.id);
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
}
