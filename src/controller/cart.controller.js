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

export async function addToCart(req, res) {
  try {
    const { user_Id, product_Id, count } = req.body;
    
    if (!user_Id || !product_Id || !count) {
      throw new ClientError("Missing required fields", 400);
    }
    
    let orders = await readFile("order");
    
    let order = orders.find(o => o.user_Id === user_Id && o.product_Id === product_Id);
    if (order) {
      order.count += count;
    } else {
      const orderId = orders.length ? orders[orders.length - 1].orderId + 1 : 1;
      orders.push({ orderId, user_Id, product_Id, count });
    }

    await writeFile("order", orders);
    res.json({ message: 'Added to cart', orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getCartByUserId(req, res) {
  try {
    const orders = await readFile("order");
    const userOrders = orders.filter(o => o.user_Id == req.params.userId);
    res.json(userOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function clearCart(req, res) {
  try {
    const orders = await readFile("order");
    const updatedOrders = orders.filter(o => o.user_Id != req.user.id);
    await writeFile("order", updatedOrders);
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateCartItem(req, res) {
  try {
    const { user_Id, product_Id, count } = req.body;
    
    if (!user_Id || !product_Id || !count) {
      throw new ClientError("Missing required fields", 400);
    }
    
    let orders = await readFile("order");
    const orderIndex = orders.findIndex(o => o.user_Id === user_Id && o.product_Id === product_Id);
    
    if (orderIndex !== -1) {
      orders[orderIndex].count = count;
      await writeFile("order", orders);
      res.json({ message: 'Cart item updated', order: orders[orderIndex] });
    } else {
      throw new ClientError("Cart item not found", 404);
    }
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}
