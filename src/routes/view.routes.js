import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";

const viewRouter = Router();

viewRouter.get("/", async (req, res) => {
  const products = await req.readFile("products"); // ✅ JSON fayldan o'qish
  res.render("pages/index", {
    title: "Bosh sahifa",
    user: req.user,
    products
  });
});

viewRouter.get("/login", (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("pages/login", { title: "Login" });
});

viewRouter.get("/register", (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("pages/register", { title: "Ro'yxatdan o'tish" });
});

viewRouter.get("/profile", requireAuth, (req, res) => {
  res.render("pages/profile", {
    title: "Profilingiz",
    user: req.user
  });
});

viewRouter.get("/bookmarks", requireAuth, async (req, res) => {
  try {
    const bookmarks = await req.readFile("bookmarks");
    const userBookmarks = bookmarks.filter(b => b.user_Id == req.user.id);
    
    // Get product details for bookmarks
    const products = await req.readFile("products");
    const bookmarkedProducts = userBookmarks.map(bookmark => {
      const product = products.find(p => p.id === bookmark.product_Id);
      return product;
    }).filter(Boolean);
    
    res.render("pages/bookmarks", {
      title: "Tanlanganlar",
      user: req.user,
      bookmarks: bookmarkedProducts
    });
  } catch (error) {
    res.status(500).render("pages/404", { title: "Error" });
  }
});

viewRouter.get("/payment", requireAuth, async (req, res) => {
  try {
    // Foydalanuvchining savatchasini olish
    const orders = await req.readFile("order");
    const userOrders = orders.filter(o => o.user_Id == req.user.id);
    
    if (userOrders.length === 0) {
      return res.redirect("/");
    }
    
    // Mahsulot ma'lumotlarini olish
    const products = await req.readFile("products");
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
    
    res.render("pages/payment", {
      title: "To'lov",
      user: req.user,
      orderItems: orderItems,
      totalAmount: totalAmount
    });
  } catch (error) {
    res.status(500).render("pages/404", { title: "Error" });
  }
});

export { viewRouter };
