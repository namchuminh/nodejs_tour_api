const { Op } = require('sequelize'); 
const Tours = require("../models/tour.model.js");

class tours {
    //[GET] /tours
    async index(req, res) {
        try {
            const { s } = req.query;
            let { page } = req.query;
            const limit = 2;
            let offset = 0;

            if(page){
                if(page <= 0){
                    page = 1;
                }
                offset = (page - 1) * limit;
            }
            
            let data;

            if (s) {
                data = await Tours.findAndCountAll({
                    where: { TenTour: { [Op.like]: '%' + s + '%' } },
                    limit,
                    offset,
                });
            } else {
                data = await Tours.findAndCountAll({ limit, offset, order: [['MaTour', 'DESC']], });
            }

            const totalPages = Math.ceil(data.count / limit);
            return res.status(200).json({ data: data.rows, totalPages, perPage: limit, totalRows: data.count, currentPage: page ? page : 1  });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Đã xảy ra lỗi" });
        }
    }

    //[POST] /tours
    async add(req, res) {
        try{
            const {TenTour,MoTa,GiaVe,SoLuongVe,MaDiemDen,DuongDan} = req.body;
            if(!TenTour || !MoTa || !GiaVe || !SoLuongVe || !MaDiemDen || !DuongDan){
                return res.status(400).json({ error: "Vui lòng nhập đủ thông tin Tour!" });
            }

            if(!/^[0-9]+$/.test(GiaVe)) return res.status(400).json({ error: "Giá vé phải là một số!" });

            if(!/^[0-9]+$/.test(SoLuongVe)) return res.status(400).json({ error: "Số lượng vé phải là một số!" });

            if(!/^[0-9]+$/.test(MaDiemDen)) return res.status(400).json({ error: "Vui lòng chọn điểm đến hợp lệ!" });

            // Lấy đường dẫn lưu trữ file ảnh
            const AnhChinh = req.file.path.replace(/\\/g, "/");
                
            const createdTour = await Tours.create({TenTour,MoTa,GiaVe,SoLuongVe,MaDiemDen,AnhChinh,DuongDan,MaNhanVien: req.user.MaNhanVien});

            if(!createdTour) return res.status(400).json({ error: "Thêm Tour thất bại, vui lòng thử lại!" });

            return res.status(201).json({ data: createdTour });

        }catch (error) {
            res.status(500).json({ error: "Đã xảy ra lỗi chưa xác định!" });
        }
    }

    //[PUT] /tours/:id
    async edit(req, res) {
        try{
            const {TenTour,MoTa,GiaVe,SoLuongVe,MaDiemDen,DuongDan} = req.body;
            const {id} = req.params;

            if(!id) return res.status(400).json({ error: "Thiếu tham số!" });

            const tour = await Tours.findOne({
                where: {
                  MaTour: id
                }
            });

            if(!tour) return res.status(404).json({ error: "Không tìm thấy Tour!" });

            if(!TenTour || !MoTa || !GiaVe || !SoLuongVe || !MaDiemDen || !DuongDan){
                return res.status(400).json({ error: "Vui lòng nhập đủ thông tin Tour!" });
            }

            if(!/^[0-9]+$/.test(GiaVe)) return res.status(400).json({ error: "Giá vé phải là một số!" });

            if(!/^[0-9]+$/.test(SoLuongVe)) return res.status(400).json({ error: "Số lượng vé phải là một số!" });

            if(!/^[0-9]+$/.test(MaDiemDen)) return res.status(400).json({ error: "Vui lòng chọn điểm đến hợp lệ!" });

            if (!req.file) {
                const updatedTour = await Tours.update({TenTour,MoTa,GiaVe,SoLuongVe,MaDiemDen,DuongDan}, {
                    where: {
                      MaTour: id,
                    },
                });

                if(!updatedTour) return res.status(400).json({ error: "Cập nhật Tour thất bại, vui lòng thử lại!" });
            }else{
                // Lấy đường dẫn lưu trữ file ảnh
                const AnhChinh = req.file.path.replace(/\\/g, "/");
                    
                const updatedTour = await Tours.update({TenTour,MoTa,GiaVe,SoLuongVe,MaDiemDen,AnhChinh,DuongDan}, {
                    where: {
                      MaTour: id,
                    },
                });

                if(!updatedTour) return res.status(400).json({ error: "Cập nhật Tour thất bại, vui lòng thử lại!" });
            }

            const tourUpdated = await Tours.findOne({ where: { MaTour: id } });
            return res.status(200).json({ data: tourUpdated });
        }catch (error) {
            res.status(500).json({ error: "Đã xảy ra lỗi chưa xác định!" });
        }
    }

    //[DELETE] /tours/:id
    async remove(req, res) {
        try{
            const {id} = req.params;

            if(!id) return res.status(400).json({ error: "Thiếu tham số!" });

            const tour = await Tours.findOne({
                where: {
                  MaTour: id
                }
            });

            if(!tour) return res.status(404).json({ error: "Không tìm thấy Tour!" });
            
            const tourDeleted = await Tours.destroy({ where: { MaTour: id } });

            if(!tourDeleted) return res.status(404).json({ error: "Xóa Tour không thành công, vui lòng thử lại!" });
            
            return res.status(200).json({ data: tour });
        }catch (error) {
            res.status(500).json({ error: "Đã xảy ra lỗi chưa xác định!" });
        }
    }
}

module.exports = new tours();