import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../db/order.json');

function read() {
  return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : [];
}

function write(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function addToCart(req, res) {
  const { user_Id, product_Id, count } = req.body;
  let orders = read();

  let order = orders.find(o => o.user_Id === user_Id && o.product_Id === product_Id);
  if (order) {
    order.count += count;
  } else {
    const orderId = orders.length ? orders[orders.length - 1].orderId + 1 : 1;
    orders.push({ orderId, user_Id, product_Id, count });
  }

  write(orders);
  res.json({ message: 'Added to cart', orders });
}

// Foydalanuvchining savatini olish
export function getCartByUserId(req, res) {
  const orders = read().filter(o => o.user_Id == req.params.userId);
  res.json(orders);
}
