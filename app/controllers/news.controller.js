const { Op } = require('sequelize'); 
const TinTuc = require("../models/tintuc.model.js");
const Categories = require("../models/chuyenmuc.model.js");

class news {
    //[GET] /news
    async index(req, res) {
        try {
            const { s } = req.query;
            let { page } = req.query;
            const limit = 10;
            let offset = 0;

            if(page){
                if(page <= 0){
                    page = 1;
                }
                offset = (page - 1) * limit;
            }
            
            let data;

            if (s) {
                data = await TinTuc.findAndCountAll({
                    where: { TieuDe: { [Op.like]: '%' + s + '%' } },
                    limit,
                    offset,
                });
            } else {
                data = await TinTuc.findAndCountAll({ limit, offset, order: [['MaTinTuc', 'DESC']], });
            }

            const totalPages = Math.ceil(data.count / limit);
            return res.status(200).json({ data: data.rows, totalPages, perPage: limit, totalRows: data.count, currentPage: page ? page : 1  });
        } catch (message) {
            console.log(message);
            res.status(500).json({ message: "Đã xảy ra lỗi" });
        }
    }

    //[GET] /news/:id
    async detail(req, res) {
        try{
            const {id} = req.params;

            if(!id) return res.status(400).json({ message: "Thiếu tham số!" });

            const news = await TinTuc.findOne({
                where: {
                  MaTinTuc: id
                }
            });

            if(!news) return res.status(404).json({ message: "Không tìm thấy tin tức!" });
                        
            return res.status(200).json({ data: news });
        }catch (message) {
            res.status(500).json({ message: "Đã xảy ra lỗi chưa xác định!" });
        }
    }

    //[POST] /news
    async add(req, res) {
        try{
            const {TieuDe,NoiDung,MaChuyenMuc,DuongDan} = req.body;
            if(!TieuDe || !NoiDung || !MaChuyenMuc || !DuongDan){
                return res.status(400).json({ message: "Vui lòng nhập đủ thông tin tin tức!" });
            }

            if(!/^[0-9]+$/.test(MaChuyenMuc)) return res.status(400).json({ message: "Mã chuyên mục phải là một số!" });
            if(!await Categories.findOne({ where: { MaChuyenMuc } })) return res.status(400).json({ message: "Mã chuyên mục không tồn tại!" });

            // Lấy đường dẫn lưu trữ file ảnh
            const AnhChinh = req.file.path.replace(/\\/g, "/");
                
            const createdNews= await TinTuc.create({TieuDe,NoiDung,MaChuyenMuc,DuongDan,AnhChinh,MaNhanVien: req.user.MaNhanVien});

            if(!createdNews) return res.status(400).json({ message: "Thêm tin tức thất bại, vui lòng thử lại!" });

            return res.status(201).json({ data: createdNews });

        }catch (message) {
            res.status(500).json({ message: "Đã xảy ra lỗi chưa xác định!" });
        }
    }

    //[PUT] /news/:id
    async edit(req, res) {
        try{
            const {TieuDe,NoiDung,MaChuyenMuc,DuongDan} = req.body;
            const {id} = req.params;

            if(!id) return res.status(400).json({ message: "Thiếu tham số!" });

            const news = await TinTuc.findOne({
                where: {
                    MaTinTuc: id
                }
            });

            if(!news) return res.status(404).json({ message: "Không tìm thấy tin tức!" });

            if(!TieuDe || !NoiDung || !MaChuyenMuc || !DuongDan){
                return res.status(400).json({ message: "Vui lòng nhập đủ thông tin tin tức!" });
            }

            if(!/^[0-9]+$/.test(MaChuyenMuc)) return res.status(400).json({ message: "Mã chuyên mục phải là một số!" });
            if(!await Categories.findOne({ where: { MaChuyenMuc } })) return res.status(400).json({ message: "Mã chuyên mục không tồn tại!" });

            if (!req.file) {
                const updatedNews = await TinTuc.update({TieuDe,NoiDung,MaChuyenMuc,DuongDan,AnhChinh}, {
                    where: {
                      MaTinTuc: id,
                    },
                });

                if(!updatedNews) return res.status(400).json({ message: "Cập nhật tin tức thất bại, vui lòng thử lại!" });
            }else{
                // Lấy đường dẫn lưu trữ file ảnh
                const AnhChinh = req.file.path.replace(/\\/g, "/");
                    
                const updatedNews = await TinTuc.update({TieuDe,NoiDung,MaChuyenMuc,DuongDan,AnhChinh}, {
                    where: {
                      MaTinTuc: id,
                    },
                });

                if(!updatedNews) return res.status(400).json({ message: "Cập nhật tin tức thất bại, vui lòng thử lại!" });
            }

            const newsUpdated = await TinTuc.findOne({ where: { MaTinTuc: id } });
            return res.status(200).json({ data: newsUpdated });
        }catch (message) {
            res.status(500).json({ message: "Đã xảy ra lỗi chưa xác định!" });
        }
    }

    //[DELETE] /news/:id
    async remove(req, res) {
        try{
            const {id} = req.params;

            if(!id) return res.status(400).json({ message: "Thiếu tham số!" });

            const news = await TinTuc.findOne({
                where: {
                    MaTinTuc: id
                }
            });

            if(!news) return res.status(404).json({ message: "Không tìm thấy tin tức!" });
            
            const newsDeleted = await TinTuc.destroy({ where: { MaTinTuc: id } });

            if(!newsDeleted) return res.status(404).json({ message: "Xóa tin tức không thành công, vui lòng thử lại!" });
            
            return res.status(200).json({ data: news });
        }catch (message) {
            res.status(500).json({ message: "Đã xảy ra lỗi chưa xác định!" });
        }
    }
}

module.exports = new news();