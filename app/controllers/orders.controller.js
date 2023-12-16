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
                if(req.user.ChucVu == 0 && req.user.MaKhachHang){
                    data = await Orders.findAndCountAll({ where: { MaKhachHang: req.user.MaKhachHang }, limit, offset, order: [['MaDonHang', 'DESC']], attributes: { exclude: ['MaDonHang']}});
                }else{
                    data = await Orders.findAndCountAll({ limit, offset, order: [['MaDonHang', 'DESC']], attributes: { exclude: ['MaDonHang']}});
                }
                
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
        } catch (message) {
            console.log(message);
            res.status(500).json({ message: "Đã xảy ra lỗi" });
        }
    }

    //[GET] /orders/:id
    async detail(req, res) {
        try{
            const {id} = req.params;

            if(!id) return res.status(400).json({ message: "Thiếu tham số!" });

            const orders = await Orders.findOne({
                where: {
                    MaTimKiem: id
                },
                attributes: { exclude: ['MaDonHang']}
            });

            if(!orders) return res.status(404).json({ message: "Không tìm thấy đơn đặt vé!" });

            if(req.user.ChucVu == 0 && req.user.MaKhachHang != orders.MaKhachHang) return res.status(403).json({ message: "Không được phép!" });

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
        }catch (message) {
            res.status(500).json({ message: "Đã xảy ra lỗi chưa xác định!" });
        }
    }

    //[POST] /orders
    async add(req, res) {
        try{
            const {MaTour,SoLuongVe,GhiChu,PhuongThucThanhToan} = req.body;
            if(!MaTour || !SoLuongVe || !GhiChu || !PhuongThucThanhToan){
                return res.status(400).json({ message: "Vui lòng nhập đủ thông tin đặt vé!" });
            }

            if(!/^[0-9]+$/.test(MaTour)) return res.status(400).json({ message: "Vui lòng chọn Tour cần đặt vé!" });
            if(!/^[0-9]+$/.test(SoLuongVe)) return res.status(400).json({ message: "Số lượng vé phải là một số!" });
            if(!/^(Tiền mặt|Chuyển khoản)$/.test(PhuongThucThanhToan)) return res.status(400).json({ message: "Vui lòng chọn phương thức thanh toán!" });
            
            const tour = await Tours.findOne({ where: { MaTour } });

            if(!tour) return res.status(400).json({ message: "Không tồn tại Tour này, vui lòng đặt Tour khác!" });

            if(tour.SoLuongVe <= 0) return res.status(400).json({ message: "Tour đã hết vé, vui lòng đặt Tour khác!" });

            if(SoLuongVe > tour.SoLuongVe) return res.status(400).json({ message: `Số lượng vé đặt không được phép lớn hơn ${tour.SoLuongVe} vé!` });

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

            if(!createdOrder) return res.status(400).json({ message: "Đặt vé cho Tour thất bại, vui lòng thử lại!" });

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
        }catch (message) {
            res.status(500).json({ message: "Đã xảy ra lỗi chưa xác định!" });
        }
    }

    //[POST] /orders/:id/cancel
    async cancel(req, res) {
        try{
            const {id} = req.params;

            if(!id) return res.status(400).json({ message: "Thiếu tham số!" });

            const orders = await Orders.findOne({
                where: {
                    MaTimKiem: id
                }
            });

            if(!orders) return res.status(404).json({ message: "Không tìm thấy đơn đặt vé!" });

            if(req.user.ChucVu == 0 && req.user.MaKhachHang != orders.MaKhachHang) return res.status(403).json({ message: "Không được phép!" });

            const cancelOrders = await Orders.update({TrangThai: 0}, {
                where: {
                    MaTimKiem: id,
                },
            });

            return res.status(200).json({ message: "Hủy đơn đặt vé thành công!" });

        }catch (message) {
            res.status(500).json({ message: "Đã xảy ra lỗi chưa xác định!" });
        }
    }
}
module.exports = new orders();