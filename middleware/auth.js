const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).redirect("/login");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).redirect("/login");
    }
};

const ensureFarmer = (req, res, next) => {
    if (req.user && req.user.isFarmer) {
        return next();
    }
    res.status(403).send("Access denied. Only farmers can access this page.");
};

module.exports = { auth, ensureFarmer };