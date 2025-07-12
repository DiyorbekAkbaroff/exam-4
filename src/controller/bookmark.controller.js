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

export async function addBookmark(req, res) {
  try {
    const { user_Id, product_Id } = req.body;
    
    if (!user_Id || !product_Id) {
      throw new ClientError("Missing required fields", 400);
    }
    
    let bookmarks = await readFile("bookmarks");
    
    // Check if bookmark already exists
    const existingBookmark = bookmarks.find(b => b.user_Id === user_Id && b.product_Id === product_Id);
    
    if (existingBookmark) {
      // Remove bookmark if it exists (toggle functionality)
      bookmarks = bookmarks.filter(b => !(b.user_Id === user_Id && b.product_Id === product_Id));
      await writeFile("bookmarks", bookmarks);
      res.json({ message: 'Bookmark removed', bookmarks });
    } else {
      // Add new bookmark
      bookmarks.push({ user_Id, product_Id });
      await writeFile("bookmarks", bookmarks);
      res.json({ message: 'Bookmark added', bookmarks });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getBookmarks(req, res) {
  try {
    const bookmarks = await readFile("bookmarks");
    const userBookmarks = bookmarks.filter(b => b.user_Id == req.params.userId);
    
    // Get product details for bookmarks
    const products = await readFile("products");
    const bookmarkedProducts = userBookmarks.map(bookmark => {
      const product = products.find(p => p.id === bookmark.product_Id);
      return product;
    }).filter(Boolean);
    
    res.json(bookmarkedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
