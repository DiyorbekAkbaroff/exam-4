import express from "express";
import path from "path";
import layout from "express-ejs-layouts";
import { fileURLToPath } from "url";
import { serverConfig } from "./config.js";
import { viewRouter } from "./routes/view.routes.js";
import { mainRouter } from "./routes/main.routes.js";
import { model } from "./model/model.js";

// API routerlar
import cartRoutes from "./routes/card.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import bookmarkRoutes from "./routes/bookmark.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Layout va frontend sozlamalari
app.set("layout", "layout/layout");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // ✅ TUZATILGAN QATOR
app.use(express.static(path.join(__dirname, "..", "public"))); // agar public tashqarida bo‘lsa
app.use(layout);

// Body parserlar
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(model);

// View yo‘nalishlari
app.use(viewRouter);

// API yo‘nalishlari
app.use("/api", mainRouter);
app.use("/api/cart", cartRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/bookmark", bookmarkRoutes);

// Serverni ishga tushurish
let { PORT } = serverConfig;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
