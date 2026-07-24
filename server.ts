import express from "express";
import path from "path";
import fs from "fs";
import { put } from "@vercel/blob";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const IMPORTS_FILE = process.env.VERCEL ? path.join('/tmp', 'imported_products.json') : path.join(process.cwd(), 'imported_products.json');
const CONFIG_FILE = process.env.VERCEL ? path.join('/tmp', 'telegram_config.json') : path.join(process.cwd(), 'telegram_config.json');

let inMemoryImports: any[] | null = null;

// Helper to read imported products from JSON
function readImportedProducts(): any[] {
  if (inMemoryImports !== null) return inMemoryImports;
  try {
    if (fs.existsSync(IMPORTS_FILE)) {
      const data = fs.readFileSync(IMPORTS_FILE, 'utf8');
      inMemoryImports = JSON.parse(data);
      return inMemoryImports || [];
    }
  } catch (err) {
    console.error('Error reading imports file:', err);
  }
  inMemoryImports = [];
  return inMemoryImports;
}

// Helper to write imported products to JSON
function writeImportedProducts(products: any[]) {
  inMemoryImports = products;
  try {
    fs.writeFileSync(IMPORTS_FILE, JSON.stringify(products, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing imports file:', err);
  }
}

// Telegram config helpers
interface TelegramConfig {
  botToken: string;
  webhookUrl: string;
  autoPublish: boolean;
}

let inMemoryConfig: TelegramConfig | null = null;

function readTelegramConfig(): TelegramConfig {
  if (inMemoryConfig !== null) return inMemoryConfig;
  let loaded: Partial<TelegramConfig> = {};
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      loaded = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading telegram config:', err);
  }
  inMemoryConfig = {
    botToken: (loaded.botToken && !loaded.botToken.includes('AAH_KOQMidQTH')) ? loaded.botToken : "8944102647:AAF5HcF6PlvUnl7Hkrrs3soR2pRRnq3UtWw",
    webhookUrl: loaded.webhookUrl || process.env.TELEGRAM_WEBHOOK_URL || "https://moviq-sooty.vercel.app/api/telegram-webhook",
    autoPublish: loaded.autoPublish ?? false
  };
  return inMemoryConfig;
}

function writeTelegramConfig(cfg: TelegramConfig) {
  inMemoryConfig = cfg;
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing telegram config:', err);
  }
}

// Persistent Cloud / Vercel Blob Image Storage
async function downloadTelegramFile(fileId: string, botToken: string): Promise<string> {
  if (!botToken) {
    throw new Error("Telegram bot token is not configured.");
  }

  // 1. Get file path from Telegram API
  const getFileUrl = `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`;
  const res = await fetch(getFileUrl);
  const data = await res.json();

  if (!data.ok || !data.result?.file_path) {
    throw new Error(`Telegram getFile API failed: ${data.description || 'Unknown error'}`);
  }

  const filePath = data.result.file_path;
  const downloadUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;

  // 2. Download binary stream
  const imgRes = await fetch(downloadUrl);
  if (!imgRes.ok) {
    throw new Error(`Failed to download file from Telegram: ${imgRes.statusText}`);
  }

  const arrayBuffer = await imgRes.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext = path.extname(filePath) || '.jpg';
  const filename = `telegram_imports/tg_${Date.now()}_${Math.floor(Math.random() * 10000)}${ext}`;
  const contentType = imgRes.headers.get('content-type') || (ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg');

  // 3. Try Vercel Blob Storage if BLOB_READ_WRITE_TOKEN is present
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blobResult = await put(filename, buffer, {
        access: 'public',
        contentType,
      });
      if (blobResult?.url) {
        console.log('Saved image to Vercel Blob:', blobResult.url);
        return blobResult.url;
      }
    } catch (blobErr: any) {
      console.error('Vercel Blob upload failed, falling back to persistent Data URI:', blobErr.message);
    }
  }

  // 4. Try Cloudinary if CLOUDINARY_CLOUD_NAME & CLOUDINARY_PRESET are set
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_PRESET) {
    try {
      const formData = new FormData();
      const blob = new Blob([buffer], { type: contentType });
      formData.append('file', blob);
      formData.append('upload_preset', process.env.CLOUDINARY_PRESET);
      const cRes = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const cData = await cRes.json();
      if (cData.secure_url) {
        console.log('Saved image to Cloudinary:', cData.secure_url);
        return cData.secure_url;
      }
    } catch (cErr: any) {
      console.error('Cloudinary upload error:', cErr.message);
    }
  }

  // 5. Persistent Base64 Data URI - 100% cloud & serverless compatible, no local filesystem needed
  const base64Data = buffer.toString('base64');
  return `data:${contentType};base64,${base64Data}`;
}

// Intelligent Caption & Metadata Parser
function parseTelegramCaption(text: string = '') {
  const clean = text.trim();
  if (!clean) {
    return {
      name: "Imported Designer Item",
      brand: "Luxury Brand",
      category: "Sneakers",
      supplierPrice: 12500,
      sizes: ["40", "41", "42", "43", "44"],
      description: "Imported via Telegram photo message"
    };
  }

  const lines = clean.split('\n').map(l => l.trim()).filter(Boolean);

  const knownBrands = [
    'Louis Vuitton', 'Dior', 'Gucci', 'Balenciaga', 'Nike', 'Jordan', 
    'Prada', 'Yves Saint Laurent', 'YSL', 'Chanel', 'Hermès', 'Adidas', 
    'Off-White', 'Alexander McQueen', 'Bottega Veneta', 'Versace', 'Fendi', 'Rolex'
  ];

  let detectedBrand = 'Imported Luxury';
  for (const b of knownBrands) {
    if (new RegExp(b, 'i').test(clean)) {
      detectedBrand = b;
      break;
    }
  }

  // Price detection (e.g. 12000, 12000 EGP, 12,500 L.E., $450)
  let price = 12500;
  const priceMatch = clean.match(/(\d[\d\s,]*\d|\d+)\s*(EGP|LE|LE\.|EGP\.|USD|\$|egp|le)/i) ||
                     clean.match(/(EGP|LE|LE\.|EGP\.|USD|\$)\s*(\d[\d\s,]*\d|\d+)/i) ||
                     clean.match(/\b(\d{4,6})\b/);
  if (priceMatch) {
    const numStr = (priceMatch[1] || priceMatch[2]).replace(/[\s,]/g, '');
    const parsedNum = parseInt(numStr, 10);
    if (!isNaN(parsedNum) && parsedNum > 100) {
      price = parsedNum;
    }
  }

  // Sizes detection
  let sizes = ['40', '41', '42', '43', '44'];
  const sizeMatch = clean.match(/\b(sizes?|sizes? range|eu)?\s*:?\s*(\d{2}\s*[-,\/]\s*\d{2}|\d{2}(\s*,\s*\d{2})+)\b/i);
  if (sizeMatch) {
    const rangeStr = sizeMatch[2];
    if (rangeStr.includes('-')) {
      const parts = rangeStr.split('-').map(s => parseInt(s.trim(), 10));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parts[0] < parts[1] && parts[0] >= 35 && parts[1] <= 48) {
        sizes = [];
        for (let i = parts[0]; i <= parts[1]; i++) sizes.push(String(i));
      }
    } else {
      const parsedList = rangeStr.split(/[\s,\/]+/).map(s => s.trim()).filter(s => /^\d{2}$/.test(s));
      if (parsedList.length > 0) sizes = parsedList;
    }
  }

  // Category detection
  let category = 'Sneakers';
  if (/bag|handbag|tote|backpack/i.test(clean)) category = 'Bags & Leather';
  else if (/watch|rolex|timepiece/i.test(clean)) category = 'Timepieces';
  else if (/hoodie|jacket|shirt|apparel|pants/i.test(clean)) category = 'Apparel';
  else if (/slide|sandal|mule/i.test(clean)) category = 'Footwear';

  const name = lines[0] || `${detectedBrand} Luxury Item`;

  return {
    name,
    brand: detectedBrand,
    category,
    supplierPrice: price,
    sizes: sizes.length > 0 ? sizes : ['40', '41', '42', '43', '44'],
    description: clean
  };
}

// Telegram API helper with automatic exponential retries
async function sendTelegramApiWithRetry(methodName: string, payload: any, maxRetries = 3): Promise<any> {
  const config = readTelegramConfig();
  const token = payload.botToken || config.botToken || process.env.TELEGRAM_BOT_TOKEN || "8944102647:AAF5HcF6PlvUnl7Hkrrs3soR2pRRnq3UtWw";
  const bodyPayload = { ...payload };
  delete bodyPayload.botToken;

  let attempt = 0;
  let lastError: any = null;

  while (attempt < maxRetries) {
    attempt++;
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/${methodName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });
      const data = await res.json();
      if (data.ok) {
        console.log(`[Telegram API Success] ${methodName} succeeded on attempt ${attempt}`);
        return data;
      }
      console.warn(`[Telegram API Warning] ${methodName} returned ok:false on attempt ${attempt}: ${data.description}`);
      lastError = new Error(data.description || 'Telegram API returned ok: false');
    } catch (err: any) {
      console.error(`[Telegram API Error] Network error calling ${methodName} on attempt ${attempt}:`, err?.message || err);
      lastError = err;
    }

    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, attempt * 600));
    }
  }

  throw lastError;
}

// AI Assistant Response Generator using Gemini
let aiClientInstance: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[Gemini AI Warning] GEMINI_API_KEY is not defined in environment.');
    return null;
  }
  if (!aiClientInstance) {
    aiClientInstance = new GoogleGenAI({ apiKey });
  }
  return aiClientInstance;
}

async function generateAiAssistantReply(userText: string, senderName: string = 'Customer'): Promise<string> {
  const ai = getAiClient();
  if (!ai) {
    return `Hello ${senderName}! Welcome to MOVIQ Luxury Store & Concierge. How can we assist you with our designer collection today?`;
  }

  try {
    const products = readImportedProducts();
    const catalogSummary = products.slice(0, 6).map(p => `- ${p.brand} ${p.name}: ${p.supplierPrice} EGP (${p.category})`).join('\n');

    const systemPrompt = `You are MOVIQ AI Concierge, the official personal shopping assistant for MOVIQ (Moviq Store), an exclusive high-end luxury store based in Cairo, Egypt.
Customer Name: ${senderName}.

Your Role & Persona:
- Respond in a refined, polite, luxury style.
- Match the user's language (Arabic or English).
- Answer questions regarding designer sneakers, handbags, apparel, or watches (Louis Vuitton, Dior, Rolex, Gucci, Balenciaga, YSL, Chanel, etc.).
- Inform customers that they can send photos of designer items directly to this Telegram chat to inquire about pricing or import them into our catalog queue!
- Keep responses concise, helpful, clear, and well-formatted.

Sample available catalog items:
${catalogSummary || 'Custom luxury designer import available.'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userText,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 500
      }
    });

    return response.text || `Welcome to MOVIQ Luxury Store, ${senderName}! How can we assist with your designer request today?`;
  } catch (err: any) {
    console.error('[Gemini AI Concierge Error]:', err?.message || err);
    return `Hello ${senderName}! Welcome to MOVIQ Luxury Concierge. How can we assist you with your luxury designer request today?`;
  }
}

// Common Webhook Handling Core Function
async function processTelegramWebhookUpdate(update: any) {
  console.log('[Telegram Webhook Received]: Update ID', update.update_id);
  const message = update.message || update.channel_post || update.edited_message || update.edited_channel_post;
  if (!message) {
    console.log('[Telegram Webhook] Non-message update received');
    return { ok: true, message: 'No processable message found in update' };
  }

  const senderName = message.from 
    ? `${message.from.first_name || ''} ${message.from.last_name || ''}`.trim() 
    : (message.chat?.title || 'Telegram User');
  const chatId = message.chat?.id;
  const messageId = message.message_id;
  const text = (message.text || message.caption || '').trim();

  const photoArray = message.photo;
  const document = message.document;

  let fileId: string | null = null;
  if (Array.isArray(photoArray) && photoArray.length > 0) {
    fileId = photoArray[photoArray.length - 1].file_id;
  } else if (document && document.mime_type && document.mime_type.startsWith('image/')) {
    fileId = document.file_id;
  }

  const config = readTelegramConfig();
  const botToken = config.botToken || process.env.TELEGRAM_BOT_TOKEN || "8944102647:AAF5HcF6PlvUnl7Hkrrs3soR2pRRnq3UtWw";

  // CASE 1: Photo attachment -> Process Product Import
  if (fileId) {
    let downloadedUrl = '';
    if (botToken) {
      try {
        downloadedUrl = await downloadTelegramFile(fileId, botToken);
      } catch (err: any) {
        console.error('[Telegram Webhook] Error downloading photo:', err.message);
      }
    }

    if (!downloadedUrl) {
      downloadedUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80";
    }

    const parsed = parseTelegramCaption(text);
    const mediaGroupId = message.media_group_id ? String(message.media_group_id) : null;
    const telegramMessageId = messageId ? String(messageId) : `tg-${Date.now()}`;

    const currentImports = readImportedProducts();
    let targetProduct: any = null;

    if (mediaGroupId) {
      targetProduct = currentImports.find(p => p.mediaGroupId === mediaGroupId && p.status === 'pending');
    }

    if (targetProduct) {
      if (!targetProduct.gallery.includes(downloadedUrl)) {
        targetProduct.gallery.push(downloadedUrl);
      }
      if (text && text.length > (targetProduct.description || '').length) {
        const reParsed = parseTelegramCaption(text);
        targetProduct.name = reParsed.name;
        targetProduct.brand = reParsed.brand;
        targetProduct.supplierPrice = reParsed.supplierPrice;
        targetProduct.salePrice = reParsed.supplierPrice;
        targetProduct.originalPrice = reParsed.supplierPrice;
        targetProduct.description = text;
      }
    } else {
      const productId = `prod-tg-${telegramMessageId}`;
      targetProduct = {
        id: productId,
        brand: parsed.brand,
        name: parsed.name,
        image: downloadedUrl,
        gallery: [downloadedUrl],
        originalPrice: parsed.supplierPrice,
        salePrice: parsed.supplierPrice,
        discount: 0,
        category: parsed.category,
        sizes: parsed.sizes,
        colors: [{ name: 'Standard Black', hex: '#000000' }, { name: 'Pure White', hex: '#ffffff' }],
        description: parsed.description,
        details: [
          `Supplier: Telegram Concierge`,
          `Sender: ${senderName}`,
          `Telegram Msg ID: ${telegramMessageId}`
        ],
        rating: 5.0,
        reviewsCount: 0,
        reviews: [],
        isNew: true,
        isBestSeller: false,
        isLuxury: true,
        status: config.autoPublish ? 'published' : 'pending',
        supplierPrice: parsed.supplierPrice,
        supplierName: senderName,
        telegramMessageId,
        mediaGroupId,
        telegramSender: senderName,
        createdAt: new Date().toISOString()
      };

      currentImports.unshift(targetProduct);
    }

    writeImportedProducts(currentImports);

    // Send confirmation reply back to Telegram
    if (chatId) {
      try {
        await sendTelegramApiWithRetry('sendMessage', {
          chat_id: chatId,
          text: `✅ *Photo received and saved!*\n\n📌 *${targetProduct.brand} - ${targetProduct.name}*\n💰 Price: ${targetProduct.supplierPrice} EGP\n📂 Status: ${targetProduct.status.toUpperCase()}\n\nItem has been added to the Pending Import queue.`,
          reply_to_message_id: messageId,
          parse_mode: 'Markdown'
        });
      } catch (replyErr: any) {
        console.error('[Telegram Webhook] Error sending photo confirmation reply:', replyErr?.message || replyErr);
      }
    }

    return { success: true, product: targetProduct };
  }

  // CASE 2: Text message (No photo) -> Route to Gemini AI Assistant
  if (text && chatId) {
    console.log(`[Telegram Text Message] From: ${senderName}, Message: "${text}"`);

    let replyText = '';

    if (text === '/start' || text === '/help') {
      replyText = `✨ *Welcome to MOVIQ Luxury Concierge, ${senderName}!* ✨\n\nI am your AI Concierge Assistant.\n\n🔹 *Ask Questions*: Ask about prices, designer items, or luxury shoes in our store.\n🔹 *Import Products*: Send a photo of any luxury item (with price/details) directly to this chat, and I'll import it into our store queue!\n\nHow can I assist you today?`;
    } else {
      replyText = await generateAiAssistantReply(text, senderName);
    }

    try {
      await sendTelegramApiWithRetry('sendMessage', {
        chat_id: chatId,
        text: replyText,
        reply_to_message_id: messageId,
        parse_mode: 'Markdown'
      });
      console.log(`[Telegram AI Reply Sent] Successfully replied to chat ${chatId}`);
    } catch (replyErr: any) {
      console.error('[Telegram Webhook] Failed to send AI reply to Telegram:', replyErr?.message || replyErr);
    }

    return { success: true, aiReply: replyText };
  }

  return { ok: true, message: 'Message received without text or photo attachments' };
}

// ==================== BACKEND API ROUTES ====================

// 1. GET /api/import - Retrieve all imported products
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

    const price = Number(supplierPrice) || 12500;

    // Parse colors
    let colorsList = [{ name: 'Standard Black', hex: '#000000' }, { name: 'Pure White', hex: '#ffffff' }];
    if (typeof color === 'string' && color.trim()) {
      if (color.includes(':')) {
        const parts = color.split(':');
        colorsList = [{ name: parts[0].trim(), hex: parts[1].trim() }];
      } else {
        colorsList = [{ name: color.trim(), hex: '#888888' }];
      }
    }

    // Parse sizes
    let sizesList: string[] = ['40', '41', '42', '43', '44'];
    if (Array.isArray(sizes)) {
      sizesList = sizes.map(String);
    } else if (typeof sizes === 'string' && sizes.trim()) {
      sizesList = sizes.split(',').map(s => s.trim());
    }

    const importedId = telegramMessageId ? `prod-tg-${telegramMessageId}` : `prod-import-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newProduct = {
      id: importedId,
      brand: brand || "Imported Luxury",
      name,
      image: imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      gallery: [imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"],
      originalPrice: price,
      salePrice: price,
      discount: 0,
      category: category || "Sneakers",
      sizes: sizesList,
      colors: colorsList,
      description: description || "",
      details: [
        `Supplier: ${supplierName || 'Telegram Bot'}`,
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
      supplierName: supplierName || "Telegram Import",
      telegramMessageId: telegramMessageId || "",
      createdAt: new Date().toISOString()
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

// 5. POST /api/import/update - Update details of pending import
app.post("/api/import/update", (req, res) => {
  const { id, name, brand, salePrice, category, sizes, description } = req.body;
  if (!id) return res.status(400).json({ error: "Missing product id" });

  let currentImports = readImportedProducts();
  const idx = currentImports.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: "Pending product not found" });

  currentImports[idx] = {
    ...currentImports[idx],
    ...(name ? { name } : {}),
    ...(brand ? { brand } : {}),
    ...(salePrice ? { salePrice: Number(salePrice), originalPrice: Number(salePrice), supplierPrice: Number(salePrice) } : {}),
    ...(category ? { category } : {}),
    ...(sizes ? { sizes: Array.isArray(sizes) ? sizes : String(sizes).split(',').map(s => s.trim()) } : {}),
    ...(description ? { description } : {})
  };

  writeImportedProducts(currentImports);
  res.json({ success: true, product: currentImports[idx] });
});

// ==================== TELEGRAM WEBHOOK ENDPOINTS ====================

// Support both /api/telegram-webhook and /api/telegram/webhook
app.post("/api/telegram-webhook", async (req, res) => {
  try {
    const result = await processTelegramWebhookUpdate(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/telegram/webhook", async (req, res) => {
  try {
    const result = await processTelegramWebhookUpdate(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET Telegram Config
app.get("/api/telegram/config", (req, res) => {
  try {
    const config = readTelegramConfig();
    const botToken = config.botToken || process.env.TELEGRAM_BOT_TOKEN || "";
    const maskedToken = botToken ? `${botToken.substring(0, 6)}...${botToken.substring(botToken.length - 4)}` : "";

    res.json({
      isConfigured: !!botToken,
      botTokenMasked: maskedToken,
      hasToken: !!botToken,
      webhookUrl: config.webhookUrl,
      autoPublish: config.autoPublish
    });
  } catch (err: any) {
    console.error('Error in GET /api/telegram/config:', err);
    res.status(500).json({ success: false, error: err?.message || 'Failed to get Telegram config' });
  }
});

// POST Telegram Config
app.post("/api/telegram/config", (req, res) => {
  try {
    const { botToken, webhookUrl, autoPublish } = req.body || {};
    const current = readTelegramConfig();

    if (typeof botToken === 'string' && botToken.trim()) {
      current.botToken = botToken.trim();
    }
    if (typeof webhookUrl === 'string' && webhookUrl.trim()) {
      current.webhookUrl = webhookUrl.trim();
    }
    if (typeof autoPublish === 'boolean') {
      current.autoPublish = autoPublish;
    }

    writeTelegramConfig(current);
    res.json({ success: true, config: current });
  } catch (err: any) {
    console.error('Error in POST /api/telegram/config:', err);
    res.status(500).json({ success: false, error: err?.message || 'Failed to update Telegram configuration' });
  }
});

// Set Webhook Endpoint via Telegram API
app.post("/api/telegram/set-webhook", async (req, res) => {
  try {
    const { webhookUrl, botToken } = req.body;
    const cfg = readTelegramConfig();
    const token = botToken || cfg.botToken || process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      return res.status(400).json({ error: "No Telegram Bot Token provided." });
    }
    if (!webhookUrl) {
      return res.status(400).json({ error: "Missing webhookUrl" });
    }

    const telegramRes = await fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}`);
    const telegramData = await telegramRes.json();

    if (telegramData.ok) {
      cfg.botToken = token;
      cfg.webhookUrl = webhookUrl;
      writeTelegramConfig(cfg);
      res.json({ success: true, message: telegramData.description || "Telegram webhook configured successfully!", result: telegramData });
    } else {
      res.status(400).json({ error: telegramData.description || "Failed to set Telegram webhook" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Test / Simulate Telegram Webhook Photo Submission
app.post("/api/telegram/test-import", async (req, res) => {
  try {
    const { imageUrl, caption, brand, name, price } = req.body;
    const mockMessageId = `sim-${Date.now()}`;
    const img = imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80";

    const parsed = parseTelegramCaption(caption || `${brand || 'Louis Vuitton'} Trainer ${price || 14500} EGP`);

    const newProduct = {
      id: `prod-tg-${mockMessageId}`,
      brand: brand || parsed.brand,
      name: name || parsed.name,
      image: img,
      gallery: [img],
      originalPrice: Number(price) || parsed.supplierPrice,
      salePrice: Number(price) || parsed.supplierPrice,
      discount: 0,
      category: parsed.category,
      sizes: parsed.sizes,
      colors: [{ name: 'Obsidian Black', hex: '#000000' }, { name: 'Pure White', hex: '#ffffff' }],
      description: caption || parsed.description,
      details: [`Supplier: Telegram Concierge Bot`, `Simulation Mode`, `Message ID: ${mockMessageId}`],
      rating: 5.0,
      reviewsCount: 0,
      reviews: [],
      isNew: true,
      isBestSeller: false,
      isLuxury: true,
      status: 'pending',
      supplierPrice: Number(price) || parsed.supplierPrice,
      supplierName: 'Telegram Concierge Bot',
      telegramMessageId: mockMessageId,
      telegramSender: 'Telegram Demo User',
      createdAt: new Date().toISOString()
    };

    const currentImports = readImportedProducts();
    currentImports.unshift(newProduct);
    writeImportedProducts(currentImports);

    res.json({ success: true, product: newProduct });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Global Express Error Handler to ensure valid JSON responses
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: err?.message || 'An internal server error occurred'
  });
});

// ==================== VITE SERVER INTEGRATION ====================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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

if (!process.env.VERCEL) {
  startServer();
}

export default app;

