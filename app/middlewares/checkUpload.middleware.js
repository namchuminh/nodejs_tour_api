const checkUploadedImage = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Bạn cần phải upload ảnh!' });
    }
    next();
};

module.exports = checkUploadedImage;