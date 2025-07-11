import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = path.join(__dirname, '../db/users.json');

function readUsers() {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
}

function writeUsers(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export function getProfile(req, res) {
  const user = readUsers().find(u => u.id == req.params.id);
  res.json(user || {});
}

export function updateProfile(req, res) {
  let users = readUsers();
  let idx = users.findIndex(u => u.id == req.params.id);

  if (idx !== -1) {
    users[idx] = { ...users[idx], ...req.body };
    writeUsers(users);
    res.json({ message: 'Profile updated' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
}