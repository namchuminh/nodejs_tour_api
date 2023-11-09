const { Op } = require('sequelize'); 
const crypto = require('crypto');
const Orders = require("../models/donhang.model.js");
const KhachHang = require("../models/khachhang.model.js");
const Destination = require("../models/diemden.model.js");
const Tours = require("../models/tour.model.js");

class orders {
    //[GET] /orders
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
                data = await Orders.findAndCountAll({
                    where: { MaTimKiem: { [Op.like]: '%' + s + '%' } },
                    limit,
                    offset,
                    attributes: { exclude: ['MaDonHang']}
                });
            } else {
                data = await Orders.findAndCountAll({ limit, offset, order: [['MaDonHang', 'DESC']], attributes: { exclude: ['MaDonHang']}});
            }

            const transformedData = [];

            await Promise.all(data.rows.map(async (order) => {
                const tour = await Tours.findOne({ where: { MaTour: order.MaTour } });
                const TenDiemDen = await Destination.findOne({ where: { MaDiemDen: tour.MaDiemDen } }).TenDiemDen;
                const user = await KhachHang.findOne({
                    where: {
                        MaKhachHang:order.MaKhachHang
                    },
                    attributes: { exclude: ['MatKhau']}
                });

                let TrangThai = "Đang đợi duyệt";
                let PhuongThucThanhToan = "Tiền mặt";

                if(order.TrangThai == 0){
                    TrangThai = "Đã hủy vé";
                }else if(order.TrangThai == 2){
                    TrangThai = "Đã duyệt vé";
                }else if(order.TrangThai == 3){
                    TrangThai = "Đang gửi vé";
                }else if(order.TrangThai == 4){
                    TrangThai = "Đã gửi vé";
                }else if(order.TrangThai == 1){
                    TrangThai = "Đang đợi duyệt";
                }

                if(order.PhuongThucThanhToan == 0){
                    PhuongThucThanhToan = "Tiền mặt";
                }else if(order.PhuongThucThanhToan == 1){
                    PhuongThucThanhToan = "Chuyển khoản";
                }

                const dataInsert = {
                    TenTour: tour.TenTour,
                    TenDiemDen,
                    ...order.toJSON(),
                    MaKhachHang: user,
                    TrangThai,
                    PhuongThucThanhToan
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

    //[GET] /orders/:id
    async detail(req, res) {
        try{
            const {id} = req.params;

            if(!id) return res.status(400).json({ error: "Thiếu tham số!" });

            const orders = await Orders.findOne({
                where: {
                    MaTimKiem: id
                },
                attributes: { exclude: ['MaDonHang']}
            });

            if(!orders) return res.status(404).json({ error: "Không tìm thấy đơn hàng!" });

            if(req.user.ChucVu == 0 && req.user.MaKhachHang != orders.MaKhachHang) return res.status(403).json({ data: {} });

            let TrangThai = "Đang đợi duyệt";
            let PhuongThucThanhToan = "Tiền mặt";

            if(orders.TrangThai == 0){
                TrangThai = "Đã hủy vé";
            }else if(orders.TrangThai == 2){
                TrangThai = "Đã duyệt vé";
            }else if(orders.TrangThai == 3){
                TrangThai = "Đang gửi vé";
            }else if(orders.TrangThai == 4){
                TrangThai = "Đã gửi vé";
            }else if(orders.TrangThai == 1){
                TrangThai = "Đang đợi duyệt";
            }

            if(orders.PhuongThucThanhToan == 0){
                PhuongThucThanhToan = "Tiền mặt";
            }else if(orders.PhuongThucThanhToan == 1){
                PhuongThucThanhToan = "Chuyển khoản";
            }

            const user = await KhachHang.findOne({
                where: {
                    MaKhachHang:orders.MaKhachHang
                },
                attributes: { exclude: ['MatKhau']}
            });

            const tour = await Tours.findOne({
                where: {
                    MaTour: orders.MaTour
                }
            });

            const destination = await Destination.findOne({
                where: {
                    MaDiemDen: tour.MaDiemDen
                }
            });

            const ordersWithAlias = { TenTour: tour.TenTour, TenDiemDen: destination.TenDiemDen,...orders.toJSON(), MaKhachHang: user, TrangThai, PhuongThucThanhToan };   

            return res.status(200).json({ data: ordersWithAlias });
        }catch (error) {
            res.status(500).json({ error: "Đã xảy ra lỗi chưa xác định!" });
        }
    }

    //[POST] /orders
    async add(req, res) {
        try{
            const {MaTour,SoLuongVe,GhiChu,PhuongThucThanhToan} = req.body;
            if(!MaTour || !SoLuongVe || !GhiChu || !PhuongThucThanhToan){
                return res.status(400).json({ error: "Vui lòng nhập đủ thông tin đặt vé!" });
            }

            if(!/^[0-9]+$/.test(MaTour)) return res.status(400).json({ error: "Vui lòng chọn Tour cần đặt vé!" });
            if(!/^[0-9]+$/.test(SoLuongVe)) return res.status(400).json({ error: "Số lượng vé phải là một số!" });
            if(!/^(Tiền mặt|Chuyển khoản)$/.test(PhuongThucThanhToan)) return res.status(400).json({ error: "Vui lòng chọn phương thức thanh toán!" });
            
            const tour = await Tours.findOne({ where: { MaTour } });

            if(!tour) return res.status(400).json({ error: "Không tồn tại Tour này, vui lòng đặt Tour khác!" });

            if(tour.SoLuongVe <= 0) return res.status(400).json({ error: "Tour đã hết vé, vui lòng đặt Tour khác!" });

            if(SoLuongVe > tour.SoLuongVe) return res.status(400).json({ error: `Số lượng vé đặt không được phép lớn hơn ${tour.SoLuongVe} vé!` });

            const randomBuffer = crypto.randomBytes(4);

            // Chuyển buffer thành chuỗi hex
            const MaTimKiem = randomBuffer.toString('hex').slice(0, 8).toUpperCase();

            const dataUpdated = {
                MaTimKiem,
                MaTour: tour.MaTour,
                SoLuongVe,
                GhiChu,
                PhuongThucThanhToan: PhuongThucThanhToan === "Tiền mặt" ? 0 : 1,
                TrangThai: 1,
                MaKhachHang: req.user.MaKhachHang
            }
               
            const createdOrder = await Orders.create(dataUpdated);

            if(!createdOrder) return res.status(400).json({ error: "Đặt vé cho Tour thất bại, vui lòng thử lại!" });

            const SoLuongVeMoi = tour.SoLuongVe - SoLuongVe;

            await Tours.update({SoLuongVe: SoLuongVeMoi <= 0 ? 0 : SoLuongVeMoi},{ where: { MaTour: tour.MaTour } });

            const user = await KhachHang.findOne({
                where: {
                    MaKhachHang: req.user.MaKhachHang
                },
                attributes: { exclude: ['MatKhau']}
            });

            const destination = await Destination.findOne({
                where: {
                    MaDiemDen: tour.MaDiemDen
                }
            });

            const updateOrdersWithAlias = { TenTour: tour.TenTour, TenDiemDen: destination.TenDiemDen,...createdOrder.toJSON(), MaKhachHang: user, TrangThai: "Đang đợi duyệt", PhuongThucThanhToan };

            return res.status(201).json({ data: updateOrdersWithAlias });
        }catch (error) {
            res.status(500).json({ error: "Đã xảy ra lỗi chưa xác định!" });
        }
    }

    //[DELETE] /orders/:id
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
module.exports = new orders();