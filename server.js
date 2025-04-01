require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const session = require("express-session");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const User = require("./models/User");
const Order = require("./models/Order"); 
const Product = require("./models/Product");
const { auth, ensureFarmer } = require("./middleware/auth");
const multer=require('multer')

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "frontend")));
app.use(session({ secret: "secret-key", resave: false, saveUninitialized: true }));

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Signup Route
app.post("/signup", async (req, res) => {
    const { fullName, email, password, isFarmer } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.redirect("/signup?error=User already exists");

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullName, email, password: hashedPassword, isFarmer: !!isFarmer });
        await newUser.save();

        res.redirect("/login");
    } catch (err) {
        res.redirect("/signup?error=Server error");
    }
});

// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.redirect("/login?error=Invalid credentials");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.redirect("/login?error=Invalid credentials");

        const token = jwt.sign({ id: user._id, isFarmer: user.isFarmer }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
        req.session.isFarmer = user.isFarmer;

        res.redirect("/dashboard");
    } catch (err) {
        res.redirect("/login?error=Server error");
    }
});

// Logout Route
app.get("/logout", (req, res) => {
    res.clearCookie("token");
    req.session.destroy();
    res.redirect("/login");
});

//cartttt
let cart = {}

app.post('/cart', (req, res) => {
    const receivedCart = req.body;

    if (!receivedCart || Object.keys(receivedCart).length === 0) {
        return res.status(400).json({ error: "Received empty cart data!" });
    }

    cart = receivedCart;

    // Remove items with quantity 0
    for (let productId in cart) {
        if (cart[productId].quantity === 0) {
            delete cart[productId];
        }
    }

    console.log("🛒 Cart Updated:", cart);
    res.json({ message: "Cart updated successfully!", cart });
});

// Add GET route for cart page
app.get('/cart', async (req, res) => {
    try {
        // If cart is empty or doesn't exist, pass an empty object
        if (!cart || Object.keys(cart).length === 0) {
            return res.render('cart', { cart: {} });
        }

        // Fetch product details for each item in cart
        for (let productId in cart) {
            const product = await Product.findById(productId);
            if (product) {
                cart[productId].image = product.image;
                cart[productId].available = product.quantity;
            }
        }

        res.render('cart', { cart });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Farmer Dashboard Route
app.get('/adminProfile', async (req, res) => {
    
        
        res.render('adminProfile');
    
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "public/uploads")); // Absolute path
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
    
    
});
const upload = multer({ storage: storage });

app.post('/addProduct',upload.single("image"), async (req,res)=>{
    try {
        const { name, price, quantity } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : "";

        const newProduct = new Product({
            name,
            price,
            quantity,
            image
             // Make sure the farmer ID is stored in the session
        });

        await newProduct.save();
        res.redirect("/dashboard"); // Redirect after adding product
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).send("Internal Server Error");
    }
})

app.get("/order", async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products
        res.render("ordernow", { products }); // Render products.ejs with data
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.get("/profile", async (req, res) => {
    try {
        // Fetch any user from the database (for testing)
        const user = await User.findOne(); 

        if (!user) return res.status(404).send("No users found in the database");

        // Fetch orders related to the user (for testing)
        const orders = await Order.find({ userId: user._id });

        res.render("profile", { user, orders });
    } catch (error) {
        console.error("Profile Page Error:", error);
        res.status(500).send("Server Error");
    }
});

// Configure multer for profile picture uploads
const profilePicStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "public/uploads/profiles")); // Store profile pics in a separate folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const profilePicUpload = multer({
    storage: profilePicStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Route to Handle Profile Picture Upload
app.post("/upload-profile-pic", auth, profilePicUpload.single("profilePic"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded." });
        }

        // Create the relative path for the image
        const imageUrl = `/uploads/profiles/${req.file.filename}`;

        // Update user's profile picture in the database
        await User.findByIdAndUpdate(req.user.id, { profilePic: imageUrl });

        res.status(200).json({ 
            success: true, 
            message: "Profile picture updated successfully",
            imageUrl: imageUrl 
        });
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        res.status(500).json({ 
            error: "Failed to update profile picture",
            details: error.message 
        });
    }
});

// Protected Routes
app.get("/dashboard", auth, (req, res) => res.render("dashboard"));

// Public Routes
app.get("/login", (req, res) => res.render("login"));
app.get("/signup", (req, res) => res.render("signUp"));
// app.get("/order", (req, res) => res.render("ordernow"));

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));