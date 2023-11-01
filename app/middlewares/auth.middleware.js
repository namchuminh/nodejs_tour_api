const jwt = require("jsonwebtoken");
const Blacklist = require("../models/blacklist.model.js");

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if (!token) return res.status(401).json({ error: "Token không tồn tại" });

        const blacklistedToken = await Blacklist.findOne({ where: { token: token } });
        const decoded = jwt.verify(token, "SECRET_KEY");

        if(!decoded) return res.status(401).json({ message: "Token đã hết hạn hoặc không hợp lệ!" });
        
        if (blacklistedToken) {
            return res.status(401).json({ message: "Token đã hết hạn hoặc không hợp lệ!" });
        }

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ err });
    }
};

module.exports = auth;