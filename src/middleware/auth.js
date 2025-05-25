


const authentication = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        // Verify token (this is a placeholder, implement your own verification logic)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = authenticate;
