const { Op } = require('sequelize'); 
const Destination = require("../models/diemden.model.js");
const Categories = require("../models/chuyenmuc.model.js");
const TourInformation = require("../models/thongtintour.model.js");
const Tour = require("../models/tour.model.js");
const e = require('express');

class destination {
    //[GET] /destination
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
                data = await Destination.findAndCountAll({
                    where: { TenDiemDen: { [Op.like]: '%' + s + '%' } },
                    limit,
                    offset,
                });
            } else {
                data = await Destination.findAndCountAll({ limit, offset, order: [['MaDiemDen', 'DESC']], });
            }

            const transformedData = [];

            await Promise.all(data.rows.map(async (destination) => {
                const categories = await Categories.findOne({ where: {MaChuyenMuc: destination.MaChuyenMuc} })
                const dataInsert = {
                    MaDiemDen: destination.MaDiemDen,
                    TenDiemDen: destination.TenDiemDen,
                    MoTa: destination.MoTa,
                    AnhChinh: destination.AnhChinh,
                    HinhAnh: destination.HinhAnh,
                    GoogleMap: destination.GoogleMap,
                    MaChuyenMuc: destination.MaChuyenMuc,
                    TenChuyenMuc: categories.TenChuyenMuc,
                    createdAt: destination.createdAt,
                    updatedAt: destination.updatedAt
                };
                transformedData.push(dataInsert);
            }));

            const totalPages = Math.ceil(data.count / limit);
            return res.status(200).json({ data: transformedData, totalPages, perPage: limit, totalRows: data.count, currentPage: page ? page : 1  });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Đã xảy ra lỗi" });
        }
    }

    //[GET] /destination/:id
    async detail(req, res) {
        try{
            const {id} = req.params;

            if(!id) return res.status(400).json({ error: "Thiếu tham số!" });

            const destination = await Destination.findOne({
                where: {
                  MaDiemDen: id
                }
            });

            const categories = await Categories.findOne({
                where: {
                    MaChuyenMuc: destination.MaChuyenMuc
                }
            });

            if(!destination) return res.status(404).json({ error: "Không tìm thấy điểm đến!" });
                    
            const data = {
                MaDiemDen: destination.MaDiemDen,
                TenDiemDen: destination.TenDiemDen,
                MoTa: destination.MoTa,
                AnhChinh: destination.AnhChinh,
                HinhAnh: destination.HinhAnh,
                GoogleMap: destination.GoogleMap,
                MaChuyenMuc: destination.MaChuyenMuc,
                TenChuyenMuc: categories.TenChuyenMuc,
                createdAt: destination.createdAt,
                updatedAt: destination.updatedAt
            }

            return res.status(200).json({ data });
        }catch (error) {
            res.status(500).json({ error: "Đã xảy ra lỗi chưa xác định!" });
        }
    }

    //[POST] /destination
    async add(req, res) {
        try{
            const {TenDiemDen,MoTa,MaChuyenMuc,GoogleMap} = req.body;
            if(!TenDiemDen || !MoTa || !MaChuyenMuc || !GoogleMap){
                return res.status(400).json({ error: "Vui lòng nhập đủ thông tin điểm đến!" });
            }

            if(!/^[0-9]+$/.test(MaChuyenMuc)) return res.status(400).json({ error: "Vui lòng chọn mã chuyên mục!" });
            if(!await Categories.findOne({ where: { MaChuyenMuc } })) return res.status(400).json({ error: "Chuyên mục không tồn tại!" });

            // Lấy đường dẫn lưu trữ file ảnh
            const AnhChinh = req.files[0].path.replace(/\\/g, "/");

            req.files.shift();

            let HinhAnh = "";

            await Promise.all(req.files.map((image) => {
                HinhAnh += image.path.replace(/\\/g, "/")+"#";
            }))

            const createdDestination = await Destination.create({TenDiemDen,MoTa,AnhChinh,HinhAnh: HinhAnh.slice(0,-1),GoogleMap,MaChuyenMuc});

            if(!createdDestination) return res.status(400).json({ error: "Thêm điểm đến thất bại, vui lòng thử lại!" });

            return res.status(201).json({ data: createdDestination });

        }catch (error) {
            res.status(500).json({ error: "Đã xảy ra lỗi chưa xác định!" });
        }
    }

    //[PUT] /destination/:id
    async edit(req, res) {
        try{
            const {id} = req.params;

            if(!id) return res.status(400).json({ error: "Thiếu tham số!" });

            const destination = await Destination.findOne({
                where: {
                  MaDiemDen: id
                }
            });

            if(!destination) return res.status(404).json({ error: "Không tìm thấy điểm đến!" });

            const {TenDiemDen,MoTa,MaChuyenMuc,GoogleMap} = req.body;
            if(!TenDiemDen || !MoTa || !MaChuyenMuc || !GoogleMap){
                return res.status(400).json({ error: "Vui lòng nhập đủ thông tin điểm đến!" });
            }

            if(!/^[0-9]+$/.test(MaChuyenMuc)) return res.status(400).json({ error: "Vui lòng chọn mã chuyên mục!" });
            if(!await Categories.findOne({ where: { MaChuyenMuc } })) return res.status(400).json({ error: "Chuyên mục không tồn tại!" });

            if(req.files.length <= 0){
                const destinationUpdated = await Destination.update({TenDiemDen,MoTa,MaChuyenMuc,GoogleMap}, {
                    where: {MaDiemDen: id}
                });
            }else if(req.files.length >= 1){
                if(req.files[0].fieldname == "AnhChinh" && req.files.length == 1){
                    // Lấy đường dẫn lưu trữ file ảnh
                    const AnhChinh = req.files[0].path.replace(/\\/g, "/");
                    const destinationUpdated = await Destination.update({TenDiemDen,MoTa,MaChuyenMuc,AnhChinh,GoogleMap}, {
                        where: {MaDiemDen: id}
                    });
                }else if(req.files[0].fieldname == "HinhAnh" && req.files.length >= 1){
                    let HinhAnh = "";
                    await Promise.all(req.files.map((image) => {
                        HinhAnh += image.path.replace(/\\/g, "/")+"#";
                    }))
                    const destinationUpdated = await Destination.update({TenDiemDen,MoTa,MaChuyenMuc,HinhAnh: HinhAnh.slice(0,-1),GoogleMap}, {
                        where: {MaDiemDen: id}
                    });
                }else if(req.files[0].fieldname == "AnhChinh" && req.files.length >= 2){
                    // Lấy đường dẫn lưu trữ file ảnh
                    const AnhChinh = req.files[0].path.replace(/\\/g, "/");
                    req.files.shift();
                    let HinhAnh = "";
                    await Promise.all(req.files.map((image) => {
                        HinhAnh += image.path.replace(/\\/g, "/")+"#";
                    }))
                    const updatedDestination = await Destination.update({TenDiemDen,MoTa,AnhChinh,HinhAnh: HinhAnh.slice(0,-1),GoogleMap,MaChuyenMuc}, {
                        where: {MaDiemDen: id}
                    });
                }
            }

            const destinationUpdated = await Destination.findOne({
                where: {
                  MaDiemDen: id
                }
            });

            const categories = await Categories.findOne({
                where: {
                    MaChuyenMuc: destination.MaChuyenMuc
                }
            });
                    
            const data = {
                MaDiemDen: destinationUpdated.MaDiemDen,
                TenDiemDen: destinationUpdated.TenDiemDen,
                MoTa: destinationUpdated.MoTa,
                AnhChinh: destinationUpdated.AnhChinh,
                HinhAnh: destinationUpdated.HinhAnh,
                GoogleMap: destinationUpdated.GoogleMap,
                MaChuyenMuc: destinationUpdated.MaChuyenMuc,
                TenChuyenMuc: categories.TenChuyenMuc,
                createdAt: destinationUpdated.createdAt,
                updatedAt: destinationUpdated.updatedAt
            }

            return res.status(200).json({ data });
        }catch (error) {
            res.status(500).json({ error: "Đã xảy ra lỗi chưa xác định!" });
        }
    }

    //[DELETE] /destination/:id
    async remove(req, res) {
        try{
            const {id} = req.params;

            if(!id) return res.status(400).json({ error: "Thiếu tham số!" });

            const destination = await Destination.findOne({
                where: {
                  MaDiemDen: id
                }
            });

            if(!destination) return res.status(404).json({ error: "Không tìm thấy điểm đến!" });

            if(await Tour.findOne({where: {MaDiemDen: destination.MaDiemDen}}) || await TourInformation.findOne({where: {MaDiemDen: destination.MaDiemDen}})){
                return res.status(400).json({ error: "Tồn tại Tour thuộc điểm đến này, không được phép xóa!" });
            }

            const destinationDeleted = await Destination.destroy({ where: { MaDiemDen: id } });

            if(!destinationDeleted) return res.status(404).json({ error: "Xóa điểm đến không thành công, vui lòng thử lại!" });
            
            return res.status(200).json({ data: destination });
        }catch (error) {
            res.status(500).json({ error: "Đã xảy ra lỗi chưa xác định!" });
        }
    }
}

module.exports = new destination();