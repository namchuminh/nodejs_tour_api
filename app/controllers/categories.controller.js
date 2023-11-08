const { Op } = require('sequelize'); 
const Categories = require("../models/chuyenmuc.model.js");

class categories {
    //[GET] /categories
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
                data = await Categories.findAndCountAll({
                    where: { TenChuyenMuc: { [Op.like]: '%' + s + '%' } },
                    limit,
                    offset,
                });
            } else {
                data = await Categories.findAndCountAll({ limit, offset, order: [['MaChuyenMuc', 'DESC']], });
            }

            const totalPages = Math.ceil(data.count / limit);
            return res.status(200).json({ data: data.rows, totalPages, perPage: limit, totalRows: data.count, currentPage: page ? page : 1  });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Đã xảy ra lỗi" });
        }
    }

    //[GET] /categories/:id
    async detail(req, res) {
        try{
            const {id} = req.params;

            if(!id) return res.status(400).json({ error: "Thiếu tham số!" });

            const categories = await Categories.findOne({
                where: {
                  MaChuyenMuc: id
                }
            });

            if(!categories) return res.status(404).json({ error: "Không tìm thấy chuyên mục!" });
                        
            return res.status(200).json({ data: categories });
        }catch (error) {
            res.status(500).json({ error: "Đã xảy ra lỗi chưa xác định!" });
        }
    }

    //[POST] /categories
    async add(req, res) {
        try{
            const {TenChuyenMuc,DuongDan} = req.body;
            if(!TenChuyenMuc || !DuongDan){
                return res.status(400).json({ error: "Vui lòng nhập đủ thông tin chuyên mục!" });
            }
                
            const createdCategories = await Categories.create({TenChuyenMuc,DuongDan});

            if(!createdCategories) return res.status(400).json({ error: "Thêm chuyên mục thất bại, vui lòng thử lại!" });

            return res.status(201).json({ data: createdCategories });

        }catch (error) {
            res.status(500).json({ error: "Đã xảy ra lỗi chưa xác định!" });
        }
    }

    //[PUT] /categories/:id
    async edit(req, res) {
        try{
            const {TenChuyenMuc,DuongDan} = req.body;
            const {id} = req.params;

            if(!id) return res.status(400).json({ error: "Thiếu tham số!" });

            const categories = await Categories.findOne({
                where: {
                  MaChuyenMuc: id
                }
            });

            if(!categories) return res.status(404).json({ error: "Không tìm thấy chuyên mục!" });

            if(!TenChuyenMuc || !DuongDan){
                return res.status(400).json({ error: "Vui lòng nhập đủ thông tin chuyên mục!" });
            }

            const updatedCategories = await Categories.update({TenChuyenMuc,DuongDan}, {
                where: {
                    MaChuyenMuc: id,
                },
            });

            if(!updatedCategories) return res.status(400).json({ error: "Cập nhật chuyên mục thất bại, vui lòng thử lại!" });

            const categoriesUpdated = await Categories.findOne({ where: { MaChuyenMuc: id } });
            return res.status(200).json({ data: categoriesUpdated });
        }catch (error) {
            res.status(500).json({ error: "Đã xảy ra lỗi chưa xác định!" });
        }
    }

    //[DELETE] /categories/:id
    async remove(req, res) {
        try{
            const {id} = req.params;

            if(!id) return res.status(400).json({ error: "Thiếu tham số!" });

            const categories = await Categories.findOne({
                where: {
                    MaChuyenMuc: id
                }
            });

            if(!categories) return res.status(404).json({ error: "Không tìm thấy chuyên mục!" });
            
            const categoriesDeleted = await Categories.destroy({ where: { MaChuyenMuc: id } });

            if(!categoriesDeleted) return res.status(404).json({ error: "Xóa chuyên mục không thành công, vui lòng thử lại!" });
            
            return res.status(200).json({ data: categories });
        }catch (error) {
            res.status(500).json({ error: "Đã xảy ra lỗi chưa xác định!" });
        }
    }
}
module.exports = new categories();