const checkUploadedImage = (req, res, next) => {
    if (!req.file && !req.files) {
        return res.status(400).json({ message: 'Bạn cần phải upload ảnh!' });
    }
    next();
};

module.exports = checkUploadedImage;