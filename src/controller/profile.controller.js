import { ClientError } from "shokhijakhon-error-handler";

export async function getProfile(req, res) {
  try {
    const users = await req.readFile("users");
    const user = users.find(u => u.id == req.params.id);
    
    if (!user) {
      throw new ClientError("User not found", 404);
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}

export async function updateProfile(req, res) {
  try {
    let users = await req.readFile("users");
    let idx = users.findIndex(u => u.id == req.params.id);

    if (idx === -1) {
      throw new ClientError("User not found", 404);
    }

    // Update user data (excluding password)
    const { password, ...updateData } = req.body;
    users[idx] = { ...users[idx], ...updateData };
    
    await req.writeFile("users", users);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}