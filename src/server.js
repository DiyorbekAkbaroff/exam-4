import express from "express";
import path from "path";
import layout from "express-ejs-layouts";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { serverConfig } from "./config.js";
import { viewRouter } from "./routes/view.routes.js";
import { mainRouter } from "./routes/main.routes.js";
import { model } from "./model/model.js";
import { authMiddleware } from "./middleware/auth.middleware.js";

// API routerlar
import cartRoutes from "./routes/card.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import bookmarkRoutes from "./routes/bookmark.routes.js";
import orderRoutes from "./routes/order.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Layout va frontend sozlamalari
app.set("layout", "layout/layout");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(layout);

// Body parserlar
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware
app.use(model);
app.use(authMiddleware);

//  🔑  Har safar render bo'lganda EJS uchun user ni global qilish
app.use((req, res, next) => {
    res.locals.user = req.user || null; // req.user bo'lmasa null bo'ladi
    next();
});  

// View yo'nalishlari
app.use(viewRouter);

// API yo'nalishlari
app.use("/api", mainRouter);
app.use("/api/cart", cartRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/bookmark", bookmarkRoutes);
app.use("/api/orders", orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render("pages/404", { title: "Page Not Found" });
});

// Serverni ishga tushurish
let { PORT } = serverConfig;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
