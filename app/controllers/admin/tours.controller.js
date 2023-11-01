const { Op } = require('sequelize'); 
const Tours = require("../../models/tour.model.js");

class tours {
    //[GET] /admin/tours
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

  //[POST] /admin/tours
  async add(req, res) {
    try{
        const {TenTour,MoTa,GiaVe,SoLuongVe,MaDiemDen,AnhChinh,DuongDan} = req.body;
        if(!TenTour || !MoTa || !GiaVe || !SoLuongVe || !MaDiemDen || !AnhChinh || !DuongDan){
            return res.status(400).json({ error: "Vui lòng nhập đủ thông tin Tour!" });
        }

        if(!(typeof GiaVe === 'number')) return res.status(400).json({ error: "Giá vé phải là một số!" });

        if(!(typeof SoLuongVe === 'number')) return res.status(400).json({ error: "Số lượng vé phải là một số!" });

        if(!(typeof MaDiemDen === 'number')) return res.status(400).json({ error: "Vui lòng chọn điểm đến hợp lệ!" });

        const createdTour = await Tours.create({TenTour,MoTa,GiaVe,SoLuongVe,MaDiemDen,AnhChinh,DuongDan,MaNhanVien: req.user.MaNhanVien});

        if(!createdTour) return res.status(400).json({ error: "Thêm Tour thất bại, vui lòng thử lại!" });

        return res.status(201).json({ data: createdTour });
    }catch (error) {
        res.status(500).json({ message: "Đã xảy ra lỗi" });
    }
  }
}

module.exports = new tours();