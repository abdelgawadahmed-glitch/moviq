import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

const IMPORTS_FILE = path.join(process.cwd(), 'imported_products.json');

// Helper to read imported products from JSON
function readImportedProducts(): any[] {
  try {
    if (fs.existsSync(IMPORTS_FILE)) {
      const data = fs.readFileSync(IMPORTS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading imports file:', err);
  }
  return [];
}

// Helper to write imported products to JSON
function writeImportedProducts(products: any[]) {
  try {
    fs.writeFileSync(IMPORTS_FILE, JSON.stringify(products, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing imports file:', err);
  }
}

// ==================== BACKEND API ROUTES ====================

// 1. GET /api/import - Retrieve all imported pending products
app.get("/api/import", (req, res) => {
  const imported = readImportedProducts();
  res.json(imported);
});

// 2. POST /api/import - Import a single product into Pending status
app.post("/api/import", (req, res) => {
  try {
    const {
      name,
      description,
      supplierPrice,
      supplierName,
      imageUrl,
      brand,
      category,
      color,
      sizes,
      telegramMessageId
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Missing required field: name" });
    }

    const price = Number(supplierPrice) || 0;

    // Parse colors list
    let colorsList = [{ name: 'Custom', hex: '#000000' }];
    if (typeof color === 'string' && color.trim()) {
      if (color.includes(':')) {
        const parts = color.split(':');
        colorsList = [{ name: parts[0].trim(), hex: parts[1].trim() }];
      } else {
        colorsList = [{ name: color.trim(), hex: '#888888' }];
      }
    } else if (color && typeof color === 'object') {
      const colObj = color as { name?: string; hex?: string };
      colorsList = [{ name: colObj.name || 'Custom', hex: colObj.hex || '#888888' }];
    }

    // Parse sizes list
    let sizesList: string[] = ['40', '41', '42', '43', '44'];
    if (Array.isArray(sizes)) {
      sizesList = sizes.map(String);
    } else if (typeof sizes === 'string' && sizes.trim()) {
      sizesList = sizes.split(',').map(s => s.trim());
    }

    const importedId = telegramMessageId ? `prod-tg-${telegramMessageId}` : `prod-import-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newProduct = {
      id: importedId,
      brand: brand || "Imported",
      name,
      image: imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80",
      gallery: [imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80"],
      originalPrice: price,
      salePrice: price,
      discount: 0,
      category: category || "Sneakers",
      sizes: sizesList,
      colors: colorsList,
      description: description || "",
      details: [
        `Supplier: ${supplierName || 'Unknown'}`,
        `Telegram ID: ${telegramMessageId || 'N/A'}`
      ],
      rating: 5.0,
      reviewsCount: 0,
      reviews: [],
      isNew: true,
      isBestSeller: false,
      isLuxury: true,
      status: "pending",
      supplierPrice: price,
      supplierName: supplierName || "",
      telegramMessageId: telegramMessageId || ""
    };

    const currentImports = readImportedProducts();
    if (telegramMessageId) {
      const existsIdx = currentImports.findIndex(p => String(p.telegramMessageId) === String(telegramMessageId));
      if (existsIdx > -1) {
        currentImports[existsIdx] = { ...currentImports[existsIdx], ...newProduct };
      } else {
        currentImports.unshift(newProduct);
      }
    } else {
      currentImports.unshift(newProduct);
    }

    writeImportedProducts(currentImports);

    res.json({ success: true, product: newProduct });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. POST /api/import/publish - Mark imported product as published
app.post("/api/import/publish", (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Missing product id" });

  let currentImports = readImportedProducts();
  currentImports = currentImports.map(p => {
    if (p.id === id) {
      return { ...p, status: 'published' };
    }
    return p;
  });
  writeImportedProducts(currentImports);
  res.json({ success: true });
});

// 4. POST /api/import/delete - Delete imported product from queue
app.post("/api/import/delete", (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Missing product id" });

  let currentImports = readImportedProducts();
  currentImports = currentImports.filter(p => p.id !== id);
  writeImportedProducts(currentImports);
  res.json({ success: true });
});

// ==================== VITE SERVER INTEGRATION ====================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
