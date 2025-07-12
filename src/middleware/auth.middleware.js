import { jwtService } from "../lib/jwt.js";
import { ClientError } from "shokhijakhon-error-handler";
import fs from "fs/promises";
import path from "path";

async function readFile(filename) {
    const filePath = path.join(process.cwd(), "db", filename + ".json");
    try {
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;
        
        if (!token) {
            return next();
        }

        const decoded = jwtService.verifyToken(token);
        
        // Read users to get user data
        const users = await readFile("users");
        const user = users.find(u => u.id === decoded.user_id);
        
        if (!user) {
            return next();
        }

        req.user = user;
        next();
    } catch (error) {
        next();
    }
};

export const requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    next();
}; 