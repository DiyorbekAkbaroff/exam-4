import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const file = path.join(__dirname, '../db/bookmarks.json');

function readBookmarks() {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
}

function writeBookmarks(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export function addBookmark(req, res) {
  const { user_Id, product_Id } = req.body;
  let data = readBookmarks();

  if (!data.find(b => b.user_Id === user_Id && b.product_Id === product_Id)) {
    data.push({ user_Id, product_Id });
    writeBookmarks(data);
  }

  res.json({ message: 'Bookmarked', data });
}

export function getBookmarks(req, res) {
  const bookmarks = readBookmarks().filter(b => b.user_Id == req.params.userId);
  res.json(bookmarks);
}
