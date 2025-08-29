require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const Database = require("./config/database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const database = new Database();
let db;

app.post("/api/users/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const [products] = await db.execute(
      "SELECT * FROM products ORDER BY created_at DESC"
    );
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [products] = await db.execute("SELECT * FROM products WHERE id = ?", [
      id,
    ]);

    if (products.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(products[0]);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const { name, price, quantity } = req.body;

    if (!name || price === undefined || quantity === undefined) {
      return res
        .status(400)
        .json({ error: "Name, price, and quantity are required" });
    }

    if (price < 0 || quantity < 0) {
      return res
        .status(400)
        .json({ error: "Price and quantity must be non-negative" });
    }

    const [result] = await db.execute(
      "INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)",
      [name, parseFloat(price), parseInt(quantity)]
    );

    res.status(201).json({
      message: "Product created successfully",
      productId: result.insertId,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, quantity } = req.body;

    if (!name || price === undefined || quantity === undefined) {
      return res
        .status(400)
        .json({ error: "Name, price, and quantity are required" });
    }

    if (price < 0 || quantity < 0) {
      return res
        .status(400)
        .json({ error: "Price and quantity must be non-negative" });
    }

    const [result] = await db.execute(
      "UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?",
      [name, parseFloat(price), parseInt(quantity), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute("DELETE FROM products WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(PORT, async () => {
  try {
    await database.initialize();
    db = database.getPool();
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
});

//smoother shutdown
process.on("SIGINT", async () => {
  await database.close();
  console.log("DB pool closed. Server shutting down.");
  process.exit();
});
