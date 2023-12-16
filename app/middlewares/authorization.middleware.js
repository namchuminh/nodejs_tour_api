const authorization = async (req, res, next) => {
    if(req.user.ChucVu == 0) return res.status(403).json({ message: "Không được phép!" });
    next();
};

module.exports = authorization;