const { Op } = require('sequelize'); 
const Tours = require("../models/tour.model.js");
const TourInformation = require("../models/thongtintour.model.js");
const Destination = require("../models/diemden.model.js");
const TourPolicy = require("../models/noiquytour.model.js");
const TourGallery = require("../models/hinhanhtour.model.js");

class tours {
    //[GET] /tours
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

    //[GET] /tours/:id
    async detail(req, res) {
        try{
            const {id} = req.params;

            if(!id) return res.status(400).json({ error: "Thiếu tham số!" });

            const tour = await Tours.findOne({
                where: {
                  MaTour: id
                }
            });

            if(!tour) return res.status(404).json({ error: "Không tìm thấy Tour!" });
                        
            return res.status(200).json({ data: tour });
        }catch (error) {
            res.status(500).json({ error: "Đã xảy ra lỗi chưa xác định!" });
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

    //[GET] /tours/:id/information
    async detailInformation(req, res) {
        try{
            const {id} = req.params;

            if(!id) return res.status(400).json({ error: "Thiếu tham số!" });

            const tour = await Tours.findOne({
                where: {
                  MaTour: id
                }
            });

            if(!tour) return res.status(404).json({ error: "Không tìm thấy Tour!" });

            const tourInformation = await TourInformation.findOne({
                where: {
                  MaTour: id
                }
            });

            if(!tourInformation) return res.status(404).json({ error: "Chưa có thông tin cho Tour!" });

            const destination = await Destination.findOne({
                where: {
                  MaDiemDen: tourInformation.MaDiemDen
                }
            });

            const translatedInformation = {
                MaTour: tourInformation.MaTour,
                TenTour: tour.TenTour,
                MaDiemDen: tourInformation.MaDiemDen,
                TenDiemDen: destination.TenDiemDen,
                DiemKhoiHanh: tourInformation.DiemKhoiHanh,
                NgayKhoiHanh: tourInformation.NgayKhoiHanh,
                NgayQuayVe: tourInformation.NgayQuayVe,
                KhachSan: tourInformation.KhachSan === 1 ? "Có" : "Không",
                SanBay: tourInformation.SanBay === 1 ? "Có" : "Không",
                Wifi: tourInformation.Wifi === 1 ? "Có" : "Không",
                BuaSang: tourInformation.BuaSang === 1 ? "Có" : "Không",
                BaoHiem: tourInformation.BaoHiem === 1 ? "Có" : "Không",
                PhuongTien: tourInformation.PhuongTien === 1 ? "Có" : "Không",
                createdAt: tourInformation.createdAt,
                updatedAt: tourInformation.updatedAt,
            };

            return res.status(200).json({ data: translatedInformation });
        }catch (error) {
            res.status(500).json({ error: "Đã xảy ra lỗi chưa xác định!" });
        }
    }

    //[POST] /tours/:id/information
    async addInformation(req, res) {
        try{
            const {id} = req.params;

            if(!id) return res.status(400).json({ error: "Thiếu tham số!" });

            const tour = await Tours.findOne({
                where: {
                  MaTour: id
                }
            });

            if(!tour) return res.status(404).json({ error: "Không tìm thấy Tour!" });

            const tourInformation = await TourInformation.findOne({
                where: {
                  MaTour: id
                }
            });

            if(tourInformation) return res.status(404).json({ error: "Tour này đã được thêm thông tin, vui lòng cập nhật thông tin!" });

            const {MaDiemDen,DiemKhoiHanh,NgayKhoiHanh,NgayQuayVe,KhachSan,SanBay,Wifi,BuaSang,BaoHiem,PhuongTien} = req.body;
            if(!MaDiemDen || !DiemKhoiHanh || !NgayKhoiHanh || !NgayQuayVe || !KhachSan || !SanBay || !Wifi || !BuaSang || !BaoHiem || !PhuongTien){
                return res.status(400).json({ error: "Vui lòng nhập đủ thông tin cho Tour!" });
            }

            if(!/^[0-9]+$/.test(MaDiemDen)) return res.status(400).json({ error: "Mã điểm đến phải là một số!" });
            if(!await Destination.findOne({ where: { MaDiemDen } })) return res.status(400).json({ error: "Mã điểm đến không tồn tại!" });

            if(!/^(Có|Không)$/.test(KhachSan)) return res.status(400).json({ error: "Thông tin khách sạn phải là Có hoặc Không!" });
            if(!/^(Có|Không)$/.test(SanBay)) return res.status(400).json({ error: "Thông tin sân bay phải là Có hoặc Không!" });
            if(!/^(Có|Không)$/.test(Wifi)) return res.status(400).json({ error: "Thông tin wifi phải là Có hoặc Không!" });
            if(!/^(Có|Không)$/.test(BuaSang)) return res.status(400).json({ error: "Thông tin bữa sáng phải là Có hoặc Không!" });
            if(!/^(Có|Không)$/.test(BaoHiem)) return res.status(400).json({ error: "Thông tin bảo hiểm phải là Có hoặc Không!" });
            if(!/^(Có|Không)$/.test(PhuongTien)) return res.status(400).json({ error: "Thông tin phương tiện phải là Có hoặc Không!" });

            const newTourInformation = {
                MaTour: id,
                MaDiemDen,
                DiemKhoiHanh,
                NgayKhoiHanh,
                NgayQuayVe,
                KhachSan: KhachSan === "Có" ? 1 : 0,
                SanBay: SanBay === "Có" ? 1 : 0,
                Wifi: Wifi === "Có" ? 1 : 0,
                BuaSang: BuaSang === "Có" ? 1 : 0,
                BaoHiem: BaoHiem === "Có" ? 1 : 0,
                PhuongTien: PhuongTien === "Có" ? 1 : 0,
            }

            const createdTourInformation = await TourInformation.create(newTourInformation);

            if(!createdTourInformation) return res.status(400).json({ error: "Thêm thông tin Tour thất bại, vui lòng thử lại!" });

            const Information = await TourInformation.findOne({
                where: {
                    MaTour: id
                }
            });

            const destination = await Destination.findOne({
                where: {
                    MaDiemDen
                }
            });

            const translatedInformation = {
                MaTour: Information.MaTour,
                TenTour: tour.TenTour,
                MaDiemDen: Information.MaDiemDen,
                TenDiemDen: destination.TenDiemDen,
                DiemKhoiHanh: Information.DiemKhoiHanh,
                NgayKhoiHanh: Information.NgayKhoiHanh,
                NgayQuayVe: Information.NgayQuayVe,
                KhachSan: Information.KhachSan === 1 ? "Có" : "Không",
                SanBay: Information.SanBay === 1 ? "Có" : "Không",
                Wifi: Information.Wifi === 1 ? "Có" : "Không",
                BuaSang: Information.BuaSang === 1 ? "Có" : "Không",
                BaoHiem: Information.BaoHiem === 1 ? "Có" : "Không",
                PhuongTien: Information.PhuongTien === 1 ? "Có" : "Không",
                createdAt: Information.createdAt,
                updatedAt: Information.updatedAt,
            };

            return res.status(201).json({ data: translatedInformation });

        }catch (error) {
            res.status(500).json({ error: "Đã xảy ra lỗi chưa xác định!" });
        }
    }

    //[PUT] /tours/:id/information
    async editInformation(req, res) {
        try{
            const {id} = req.params

            if(!id) return res.status(400).json({ error: "Thiếu tham số!" });

            const tour = await Tours.findOne({
                where: {
                  MaTour: id
                }
            });

            if(!tour) return res.status(404).json({ error: "Không tìm thấy Tour!" });

            const tourInformation = await TourInformation.findOne({
                where: {
                  MaTour: id
                }
            });

            if(!tourInformation) return res.status(404).json({ error: "Chưa có thông tin cho Tour!" });

            const {MaDiemDen,DiemKhoiHanh,NgayKhoiHanh,NgayQuayVe,KhachSan,SanBay,Wifi,BuaSang,BaoHiem,PhuongTien} = req.body;
            if(!MaDiemDen || !DiemKhoiHanh || !NgayKhoiHanh || !NgayQuayVe || !KhachSan || !SanBay || !Wifi || !BuaSang || !BaoHiem || !PhuongTien){
                return res.status(400).json({ error: "Vui lòng nhập đủ thông tin cho Tour!" });
            }

            if(!/^[0-9]+$/.test(MaDiemDen)) return res.status(400).json({ error: "Mã điểm đến phải là một số!" });
            if(!await Destination.findOne({ where: { MaDiemDen } })) return res.status(400).json({ error: "Mã điểm đến không tồn tại!" });

            if(!/^(Có|Không)$/.test(KhachSan)) return res.status(400).json({ error: "Thông tin khách sạn phải là Có hoặc Không!" });
            if(!/^(Có|Không)$/.test(SanBay)) return res.status(400).json({ error: "Thông tin sân bay phải là Có hoặc Không!" });
            if(!/^(Có|Không)$/.test(Wifi)) return res.status(400).json({ error: "Thông tin wifi phải là Có hoặc Không!" });
            if(!/^(Có|Không)$/.test(BuaSang)) return res.status(400).json({ error: "Thông tin bữa sáng phải là Có hoặc Không!" });
            if(!/^(Có|Không)$/.test(BaoHiem)) return res.status(400).json({ error: "Thông tin bảo hiểm phải là Có hoặc Không!" });
            if(!/^(Có|Không)$/.test(PhuongTien)) return res.status(400).json({ error: "Thông tin phương tiện phải là Có hoặc Không!" });

            const newTourInformation = {
                MaTour: id,
                MaDiemDen,
                DiemKhoiHanh,
                NgayKhoiHanh,
                NgayQuayVe,
                KhachSan: KhachSan === "Có" ? 1 : 0,
                SanBay: SanBay === "Có" ? 1 : 0,
                Wifi: Wifi === "Có" ? 1 : 0,
                BuaSang: BuaSang === "Có" ? 1 : 0,
                BaoHiem: BaoHiem === "Có" ? 1 : 0,
                PhuongTien: PhuongTien === "Có" ? 1 : 0,
            }

            const updatedTourInformation = await TourInformation.update(newTourInformation, {
                where: {
                    MaTour: id,
                },
            });

            if(!updatedTourInformation) return res.status(400).json({ error: "Cập nhật thông tin Tour thất bại, vui lòng thử lại!" });

            const Information = await TourInformation.findOne({
                where: {
                    MaTour: id
                }
            });

            const destination = await Destination.findOne({
                where: {
                    MaDiemDen
                }
            });

            const translatedInformation = {
                MaTour: Information.MaTour,
                TenTour: tour.TenTour,
                MaDiemDen: Information.MaDiemDen,
                TenDiemDen: destination.TenDiemDen,
                DiemKhoiHanh: Information.DiemKhoiHanh,
                NgayKhoiHanh: Information.NgayKhoiHanh,
                NgayQuayVe: Information.NgayQuayVe,
                KhachSan: Information.KhachSan === 1 ? "Có" : "Không",
                SanBay: Information.SanBay === 1 ? "Có" : "Không",
                Wifi: Information.Wifi === 1 ? "Có" : "Không",
                BuaSang: Information.BuaSang === 1 ? "Có" : "Không",
                BaoHiem: Information.BaoHiem === 1 ? "Có" : "Không",
                PhuongTien: Information.PhuongTien === 1 ? "Có" : "Không",
                createdAt: Information.createdAt,
                updatedAt: Information.updatedAt,
            };

            return res.status(200).json({ data: translatedInformation });

        }catch (error) {
            res.status(500).json({ error: "Đã xảy ra lỗi chưa xác định!" });
        }
    }

    //[GET] /tours/:id/policy
    async detailPolicy(req, res) {
        try{
            const {id} = req.params;

            if(!id) return res.status(400).json({ error: "Thiếu tham số!" });

            const tour = await Tours.findOne({
                where: {
                    MaTour: id
                }
            });

            if(!tour) return res.status(404).json({ error: "Không tìm thấy Tour!" });

            const tourPolicy = await TourPolicy.findOne({
                where: {
                    MaTour: id
                }
            });

            if(!tourPolicy) return res.status(404).json({ error: "Chưa có thông tin nội quy cho Tour!" });

            const destination = await Destination.findOne({
                where: {
                    MaDiemDen: tour.MaDiemDen
                }
            });

            const translatedData = {
                MaTour: tour.MaTour,
                TenTour: tour.TenTour,
                TenDiemDen: destination.TenDiemDen,
                TrangPhuc: tourPolicy.TrangPhuc,
                DoDung: tourPolicy.DoDung,
                DoTuoi: tourPolicy.DoTuoi,
                NoiQuyKhac: tourPolicy.NoiQuyKhac,
                createdAt: tourPolicy.createdAt,
                updatedAt: tourPolicy.updatedAt,
            };

            return res.status(200).json({ data: translatedData });
        }catch (error) {
            res.status(500).json({ error: "Đã xảy ra lỗi chưa xác định!" });
        }
    }

    //[POST] /tours/:id/policy
    async addPolicy(req, res) {
        try{
            const {id} = req.params;

            if(!id) return res.status(400).json({ error: "Thiếu tham số!" });

            const tour = await Tours.findOne({
                where: {
                    MaTour: id
                }
            });

            if(!tour) return res.status(404).json({ error: "Không tìm thấy Tour!" });

            const tourPolicy = await TourPolicy.findOne({
                where: {
                    MaTour: id
                }
            });

            if(tourPolicy) return res.status(404).json({ error: "Tour này đã được thêm thông tin nội quy, vui lòng cập nhật nội quy!" });

            const {TrangPhuc,DoDung,DoTuoi,NoiQuyKhac} = req.body;
            if(!TrangPhuc || !DoDung || !DoTuoi || !NoiQuyKhac){
                return res.status(400).json({ error: "Vui lòng nhập đủ thông tin nội quy cho Tour!" });
            }

            if(!/^[0-9]+$/.test(DoTuoi)) return res.status(400).json({ error: "Độ tuổi phải là một số!" });

            const createdTourPolicy = await TourPolicy.create({TrangPhuc,DoDung,DoTuoi,NoiQuyKhac,MaTour:id});

            if(!createdTourPolicy) return res.status(400).json({ error: "Thêm thông tin nội quy Tour thất bại, vui lòng thử lại!" });


            const destination = await Destination.findOne({
                where: {
                    MaDiemDen: tour.MaDiemDen
                }
            });

            const translatedData = {
                MaTour: tour.MaTour,
                TenTour: tour.TenTour,
                TenDiemDen: destination.TenDiemDen,
                TrangPhuc: TrangPhuc,
                DoDung: DoDung,
                DoTuoi: DoTuoi,
                NoiQuyKhac: NoiQuyKhac,
                createdAt: createdTourPolicy.createdAt,
                updatedAt: createdTourPolicy.updatedAt,
            };

            return res.status(201).json({ data: translatedData });
        }catch (error) {
            res.status(500).json({ error: "Đã xảy ra lỗi chưa xác định!" });
        }
    }
    
    //[PUT] /tours/:id/policy
    async editPolicy(req, res) {
        try{
            const {id} = req.params;

            if(!id) return res.status(400).json({ error: "Thiếu tham số!" });

            const tour = await Tours.findOne({
                where: {
                    MaTour: id
                }
            });

            if(!tour) return res.status(404).json({ error: "Không tìm thấy Tour!" });

            const tourPolicy = await TourPolicy.findOne({
                where: {
                    MaTour: id
                }
            });

            if(!tourPolicy) return res.status(404).json({ error: "Tour này chưa được thêm thông tin nội quy, vui lòng thêm nội quy!" });

            const {TrangPhuc,DoDung,DoTuoi,NoiQuyKhac} = req.body;
            if(!TrangPhuc || !DoDung || !DoTuoi || !NoiQuyKhac){
                return res.status(400).json({ error: "Vui lòng nhập đủ thông tin nội quy cho Tour!" });
            }

            if(!/^[0-9]+$/.test(DoTuoi)) return res.status(400).json({ error: "Độ tuổi phải là một số!" });

            const updatedTourPolicy = await TourPolicy.update({TrangPhuc,DoDung,DoTuoi,NoiQuyKhac}, {
                where: {
                    MaTour:id
                }
            });

            if(!updatedTourPolicy) return res.status(400).json({ error: "Cập nhật thông tin nội quy Tour thất bại, vui lòng thử lại!" });


            const destination = await Destination.findOne({
                where: {
                    MaDiemDen: tour.MaDiemDen
                }
            });

            const translatedData = {
                MaTour: tour.MaTour,
                TenTour: tour.TenTour,
                TenDiemDen: destination.TenDiemDen,
                TrangPhuc: TrangPhuc,
                DoDung: DoDung,
                DoTuoi: DoTuoi,
                NoiQuyKhac: NoiQuyKhac,
                createdAt: updatedTourPolicy.createdAt,
                updatedAt: updatedTourPolicy.updatedAt,
            };

            return res.status(200).json({ data: translatedData });
        }catch (error) {
            res.status(500).json({ error: "Đã xảy ra lỗi chưa xác định!" });
        }
    }

    //[GET] /tours/:id/gallery
    async detailGallery(req, res) {
        try{
            const {id} = req.params;

            if(!id) return res.status(400).json({ error: "Thiếu tham số!" });

            const tour = await Tours.findOne({
                where: {
                    MaTour: id
                }
            });

            if(!tour) return res.status(404).json({ error: "Không tìm thấy Tour!" });

            const tourGallery= await TourGallery.findAndCountAll({
                where: {
                    MaTour: id
                },
                attributes: { exclude: ['MaHinhAnh']}
            });

            const destination = await Destination.findOne({
                where: {
                    MaDiemDen: tour.MaDiemDen
                }
            });

            const transformedData = tourGallery.rows.map(gallery => ({
                MaTour: tour.MaTour,
                TenTour: tour.TenTour,
                TenDiemDen: destination.TenDiemDen,
                ...gallery.toJSON()
            }));

            return res.status(200).json({ data: transformedData });
        }catch (error) {
            res.status(500).json({ error: "Đã xảy ra lỗi chưa xác định!" });
        }
    }

    //[POST] /tours/:id/gallery
    async addGallery(req, res) {
        try{
            const {id} = req.params;

            if(!id) return res.status(400).json({ error: "Thiếu tham số!" });

            const tour = await Tours.findOne({
                where: {
                    MaTour: id
                }
            });

            if(!tour) return res.status(404).json({ error: "Không tìm thấy Tour!" });

            const destination = await Destination.findOne({
                where: {
                    MaDiemDen: tour.MaDiemDen
                }
            });

            const transformedData = [];

            await Promise.all(req.files.map(async (image) => {
                let DuongDan = image.path.replace(/\\/g, "/");
                const addImage = await TourGallery.create({ MaTour: id, DuongDan });
                const dataInsert = {
                    MaTour: tour.MaTour,
                    TenTour: tour.TenTour,
                    TenDiemDen: destination.TenDiemDen,
                    DuongDan,
                    createdAt: addImage.createdAt,
                    updatedAt: addImage.updatedAt
                };
                transformedData.push(dataInsert);
            }));

            return res.status(200).json({ data: transformedData });
        }catch (error) {
            res.status(500).json({ error: "Đã xảy ra lỗi chưa xác định!" });
        }
    }

    //[PUT] /tours/:id/gallery
    async editGallery(req, res) {
        try{
            const {id} = req.params;

            if(!id) return res.status(400).json({ error: "Thiếu tham số!" });

            const tour = await Tours.findOne({
                where: {
                    MaTour: id
                }
            });

            if(!tour) return res.status(404).json({ error: "Không tìm thấy Tour!" });

            const destination = await Destination.findOne({
                where: {
                    MaDiemDen: tour.MaDiemDen
                }
            });

            await TourGallery.destroy({ where: { MaTour: id } });

            const transformedData = [];

            await Promise.all(req.files.map(async (image) => {
                let DuongDan = image.path.replace(/\\/g, "/");
                const addImage = await TourGallery.create({ MaTour: id, DuongDan });
                const dataInsert = {
                    MaTour: tour.MaTour,
                    TenTour: tour.TenTour,
                    TenDiemDen: destination.TenDiemDen,
                    DuongDan,
                    createdAt: addImage.createdAt,
                    updatedAt: addImage.updatedAt
                };
                transformedData.push(dataInsert);
            }));

            return res.status(200).json({ data: transformedData });
        }catch (error) {
            res.status(500).json({ error: "Đã xảy ra lỗi chưa xác định!" });
        }
    }

}

module.exports = new tours();