import { ClientError } from "shokhijakhon-error-handler";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readFile(filename) {
    const filePath = path.join(process.cwd(), "db", filename + ".json");
    try {
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function writeFile(filename, data) {
    const filePath = path.join(process.cwd(), "db", filename + ".json");
    await fs.writeFile(filePath, JSON.stringify(data, null, 4));
    return true;
}

export async function createOrder(req, res) {
  try {
    const { fullName, phone, address, comment, paymentMethod } = req.body;
    
    if (!fullName || !phone || !address) {
      throw new ClientError("Barcha majburiy maydonlarni to'ldiring", 400);
    }
    
    // Foydalanuvchining savatchasini olish
    const orders = await readFile("order");
    const userOrders = orders.filter(o => o.user_Id == req.user.id);
    
    if (userOrders.length === 0) {
      throw new ClientError("Savatchangiz bo'sh", 400);
    }
    
    // Mahsulot ma'lumotlarini olish
    const products = await readFile("products");
    const orderItems = userOrders.map(order => {
      const product = products.find(p => p.id === order.product_Id);
      return {
        ...order,
        product: product
      };
    }).filter(item => item.product);
    
    // Jami summani hisoblash
    const totalAmount = orderItems.reduce((total, item) => {
      return total + (item.product.price * item.count);
    }, 0);
    
    // Buyurtma yaratish
    const newOrder = {
      id: Date.now(),
      userId: req.user.id,
      items: orderItems,
      totalAmount: totalAmount,
      deliveryFee: 5,
      finalAmount: totalAmount + 5,
      customerInfo: {
        fullName,
        phone,
        address,
        comment: comment || ''
      },
      paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString(),
      orderNumber: `ORD-${Date.now()}`
    };
    
    // Buyurtmalar faylini o'qish yoki yaratish
    let allOrders = await readFile("orders");
    
    allOrders.push(newOrder);
    await writeFile("orders", allOrders);
    
    // Savatchani tozalash
    const updatedOrders = orders.filter(o => o.user_Id != req.user.id);
    await writeFile("order", updatedOrders);
    
    res.json({
      message: "Buyurtma muvaffaqiyatli yaratildi!",
      order: newOrder
    });
    
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}

export async function getUserOrders(req, res) {
  try {
    let allOrders = await readFile("orders");
    const userOrders = allOrders.filter(order => order.userId == req.user.id);
    res.json(userOrders);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
} 