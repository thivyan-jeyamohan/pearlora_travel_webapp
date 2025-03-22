import jwt from 'jsonwebtoken';

export const verifyManager = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(403).json({ message: "Access Denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.managerId = decoded.id;
        req.hotelId = decoded.hotelId;  // Pass the hotelId to restrict manager actions
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};
