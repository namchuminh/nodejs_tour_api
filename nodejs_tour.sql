-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 01, 2023 at 07:07 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nodejs_tour`
--

-- --------------------------------------------------------

--
-- Table structure for table `blacklist`
--

CREATE TABLE `blacklist` (
  `id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `blacklist`
--

INSERT INTO `blacklist` (`id`, `token`, `createdAt`, `updatedAt`) VALUES
(11, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYU5oYW5WaWVuIjoxLCJpYXQiOjE2OTg4NTU1NjEsImV4cCI6MTY5ODk0MTk2MX0.dc3DAzaXF5RPGmD3278HYY_uxbxdPBB46M-7vd6CZTA', '2023-11-01 16:19:27', '2023-11-01 16:19:27'),
(12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYU5oYW5WaWVuIjoxLCJDaHVjVnUiOjEsImlhdCI6MTY5ODg1OTEyMSwiZXhwIjoxNjk4OTQ1NTIxfQ.VL0CBCZASiM1ut8yRkxSD4r_IUDQMkCo4YyCfm75Tos', '2023-11-01 17:19:03', '2023-11-01 17:19:03');

-- --------------------------------------------------------

--
-- Table structure for table `chuyen_muc`
--

CREATE TABLE `chuyen_muc` (
  `MaChuyenMuc` int(11) NOT NULL,
  `TenChuyenMuc` text NOT NULL,
  `DuongDan` text NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `chuyen_muc`
--

INSERT INTO `chuyen_muc` (`MaChuyenMuc`, `TenChuyenMuc`, `DuongDan`, `createdAt`, `updatedAt`) VALUES
(1, 'Du lịch Biển', 'du-lich-bien', '2023-11-02 01:07:21', '2023-11-01 18:07:21'),
(2, 'Du lịch Thành Phố', 'du-lich-thanh-pho', '2023-11-02 01:07:21', '2023-11-01 18:07:21');

-- --------------------------------------------------------

--
-- Table structure for table `diem_den`
--

CREATE TABLE `diem_den` (
  `MaDiemDen` int(11) NOT NULL,
  `TenDiemDen` text NOT NULL,
  `MoTa` text NOT NULL,
  `AnhChinh` text NOT NULL,
  `HinhAnh` text NOT NULL,
  `GoogleMap` text NOT NULL,
  `MaChuyenMuc` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `diem_den`
--

INSERT INTO `diem_den` (`MaDiemDen`, `TenDiemDen`, `MoTa`, `AnhChinh`, `HinhAnh`, `GoogleMap`, `MaChuyenMuc`, `createdAt`, `updatedAt`) VALUES
(1, 'Đà Nẵng', 'Du lịch thành phố đà nẵng', 'https://i1-dulich.vnecdn.net/2022/06/01/CauVangDaNang-1654082224-7229-1654082320.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=MeVMb72UZA27ivcyB3s7Kg', 'https://i1-dulich.vnecdn.net/2022/06/01/CauVangDaNang-1654082224-7229-1654082320.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=MeVMb72UZA27ivcyB3s7Kg', '<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d206329.5660094848!2d107.93287291578885!3d16.071498547133125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c792252a13%3A0x1df0cb4b86727e06!2zxJDDoCBO4bq1bmcsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1698859800452!5m2!1svi!2s\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>', 1, '2023-11-02 00:30:20', '2023-11-02 00:30:20'),
(2, 'Hải Phòng', 'Du lịch thành phố Hải Phòng', 'https://haiphong.gov.vn/upload/haiphong/product/2020/10/6c2a27c4e9d617884ec7-1458d2ddfe164132b95ec163ccc8e4ea.jpg', 'https://haiphong.gov.vn/upload/haiphong/product/2020/10/6c2a27c4e9d617884ec7-1458d2ddfe164132b95ec163ccc8e4ea.jpg', '<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59658.01268669285!2d106.65754712412189!3d20.84681213716073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a7af39e3f1ad3%3A0xa5ffc85ff87a07e8!2zSOG6o2kgUGjDsm5nLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1698861559514!5m2!1svi!2s\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>', 2, '2023-11-02 00:59:42', '2023-11-02 00:59:42');

-- --------------------------------------------------------

--
-- Table structure for table `don_hang`
--

CREATE TABLE `don_hang` (
  `MaDonHang` int(11) NOT NULL,
  `MaTour` int(11) NOT NULL,
  `MaKhachHang` int(11) NOT NULL,
  `SoLuongVe` int(11) NOT NULL,
  `GhiChu` int(11) NOT NULL,
  `TrangThai` int(11) NOT NULL DEFAULT 1,
  `PhuongThucThanhToan` int(11) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hinh_anh_tour`
--

CREATE TABLE `hinh_anh_tour` (
  `MaHinhAnh` int(11) NOT NULL,
  `MaTour` int(11) NOT NULL,
  `DuongDan` text NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `khach_hang`
--

CREATE TABLE `khach_hang` (
  `MaKhachHang` int(11) NOT NULL,
  `TenKhachHang` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `SoDienThoai` varchar(11) NOT NULL,
  `TaiKhoan` text NOT NULL,
  `MatKhau` text NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nhan_vien`
--

CREATE TABLE `nhan_vien` (
  `MaNhanVien` int(11) NOT NULL,
  `TenNhanVien` varchar(255) NOT NULL,
  `ChucVu` int(11) NOT NULL DEFAULT 0,
  `TaiKhoan` text NOT NULL,
  `MatKhau` text NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `nhan_vien`
--

INSERT INTO `nhan_vien` (`MaNhanVien`, `TenNhanVien`, `ChucVu`, `TaiKhoan`, `MatKhau`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin', 1, 'admin', '21232f297a57a5a743894a0e4a801fc3', '2023-11-01 22:59:24', '2023-11-01 22:59:24');

-- --------------------------------------------------------

--
-- Table structure for table `noi_quy_tour`
--

CREATE TABLE `noi_quy_tour` (
  `MaNoiQuy` int(11) NOT NULL,
  `MaTour` int(11) NOT NULL,
  `TrangPhuc` text NOT NULL,
  `DoDung` text NOT NULL,
  `DoTuoi` int(11) NOT NULL,
  `NoiQuyKhac` text NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `thong_tin_tour`
--

CREATE TABLE `thong_tin_tour` (
  `MaThongTinTour` int(11) NOT NULL,
  `MaDiemDen` int(11) NOT NULL,
  `DiemKhoiHanh` varchar(255) NOT NULL,
  `NgayKhoiHanh` datetime NOT NULL,
  `NgayQuayVe` datetime NOT NULL,
  `KhachSan` int(11) NOT NULL DEFAULT 1,
  `SanBay` int(11) NOT NULL DEFAULT 1,
  `Wifi` int(11) NOT NULL DEFAULT 1,
  `BuaSang` int(11) NOT NULL DEFAULT 1,
  `BaoHiem` int(11) NOT NULL DEFAULT 1,
  `PhuongTien` int(11) NOT NULL DEFAULT 1,
  `MaTour` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tin_tuc`
--

CREATE TABLE `tin_tuc` (
  `MaTinTuc` int(11) NOT NULL,
  `TieuDe` text NOT NULL,
  `NoiDung` text NOT NULL,
  `AnhChinh` text NOT NULL,
  `MaNhanVien` int(11) NOT NULL,
  `MaChuyenMuc` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tours`
--

CREATE TABLE `tours` (
  `MaTour` int(11) NOT NULL,
  `TenTour` varchar(255) NOT NULL,
  `MoTa` text NOT NULL,
  `GiaVe` int(11) NOT NULL,
  `SoLuongVe` int(11) NOT NULL,
  `MaDiemDen` int(11) NOT NULL,
  `AnhChinh` text NOT NULL,
  `DuongDan` text NOT NULL,
  `MaNhanVien` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `tours`
--

INSERT INTO `tours` (`MaTour`, `TenTour`, `MoTa`, `GiaVe`, `SoLuongVe`, `MaDiemDen`, `AnhChinh`, `DuongDan`, `MaNhanVien`, `createdAt`, `updatedAt`) VALUES
(1, 'Biển Đà Nẵng', 'Biển Đà Nẵng', 100000, 10, 1, 'https://i1-dulich.vnecdn.net/2022/06/01/CauVangDaNang-1654082224-7229-1654082320.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=MeVMb72UZA27ivcyB3s7Kg', 'du-lich-bien-da-nag', 1, '2023-11-02 00:31:00', '2023-11-01 18:27:39'),
(2, 'Núi Ngũ Hành Sơn', 'Núi Ngũ Hành Sơn', 100000, 10, 1, 'https://i1-dulich.vnecdn.net/2022/06/01/CauVangDaNang-1654082224-7229-1654082320.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=MeVMb72UZA27ivcyB3s7Kg', 'du-lich-nui-ngu-hanh-son', 1, '2023-11-02 00:32:28', '0000-00-00 00:00:00'),
(3, 'Cát Bà - Hải Phòng', 'Du lịch huyện đảo Cát Bà - Hải Phòng', 150000, 15, 2, 'https://haiphong.gov.vn/upload/haiphong/product/2020/10/6c2a27c4e9d617884ec7-1458d2ddfe164132b95ec163ccc8e4ea.jpg', 'du-lich-cat-ba-hai-phong', 1, '2023-11-02 01:01:07', '2023-11-02 01:01:07'),
(4, 'Thành Phố Hải Phòng', 'Du lịch TP.Hải Phòng', 150000, 15, 2, 'https://haiphong.gov.vn/upload/haiphong/product/2020/10/6c2a27c4e9d617884ec7-1458d2ddfe164132b95ec163ccc8e4ea.jpg', 'du-lich-thanh-pho-hai-phong', 1, '2023-11-02 01:01:54', '2023-11-02 01:01:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blacklist`
--
ALTER TABLE `blacklist`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chuyen_muc`
--
ALTER TABLE `chuyen_muc`
  ADD PRIMARY KEY (`MaChuyenMuc`);

--
-- Indexes for table `diem_den`
--
ALTER TABLE `diem_den`
  ADD PRIMARY KEY (`MaDiemDen`),
  ADD KEY `MaChuyenMuc` (`MaChuyenMuc`);

--
-- Indexes for table `don_hang`
--
ALTER TABLE `don_hang`
  ADD PRIMARY KEY (`MaDonHang`),
  ADD KEY `MaTour` (`MaTour`,`MaKhachHang`),
  ADD KEY `MaKhachHang` (`MaKhachHang`);

--
-- Indexes for table `hinh_anh_tour`
--
ALTER TABLE `hinh_anh_tour`
  ADD PRIMARY KEY (`MaHinhAnh`),
  ADD KEY `MaTour` (`MaTour`);

--
-- Indexes for table `khach_hang`
--
ALTER TABLE `khach_hang`
  ADD PRIMARY KEY (`MaKhachHang`);

--
-- Indexes for table `nhan_vien`
--
ALTER TABLE `nhan_vien`
  ADD PRIMARY KEY (`MaNhanVien`);

--
-- Indexes for table `noi_quy_tour`
--
ALTER TABLE `noi_quy_tour`
  ADD PRIMARY KEY (`MaNoiQuy`),
  ADD KEY `MaTour` (`MaTour`);

--
-- Indexes for table `thong_tin_tour`
--
ALTER TABLE `thong_tin_tour`
  ADD PRIMARY KEY (`MaThongTinTour`),
  ADD KEY `MaDiemDen` (`MaDiemDen`,`MaTour`),
  ADD KEY `MaTour` (`MaTour`);

--
-- Indexes for table `tin_tuc`
--
ALTER TABLE `tin_tuc`
  ADD PRIMARY KEY (`MaTinTuc`),
  ADD KEY `MaNhanVien` (`MaNhanVien`,`MaChuyenMuc`),
  ADD KEY `MaChuyenMuc` (`MaChuyenMuc`);

--
-- Indexes for table `tours`
--
ALTER TABLE `tours`
  ADD PRIMARY KEY (`MaTour`),
  ADD KEY `MaNhanVien` (`MaNhanVien`),
  ADD KEY `MaDiemDen` (`MaDiemDen`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blacklist`
--
ALTER TABLE `blacklist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `chuyen_muc`
--
ALTER TABLE `chuyen_muc`
  MODIFY `MaChuyenMuc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `diem_den`
--
ALTER TABLE `diem_den`
  MODIFY `MaDiemDen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `don_hang`
--
ALTER TABLE `don_hang`
  MODIFY `MaDonHang` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hinh_anh_tour`
--
ALTER TABLE `hinh_anh_tour`
  MODIFY `MaHinhAnh` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `khach_hang`
--
ALTER TABLE `khach_hang`
  MODIFY `MaKhachHang` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nhan_vien`
--
ALTER TABLE `nhan_vien`
  MODIFY `MaNhanVien` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `noi_quy_tour`
--
ALTER TABLE `noi_quy_tour`
  MODIFY `MaNoiQuy` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `thong_tin_tour`
--
ALTER TABLE `thong_tin_tour`
  MODIFY `MaThongTinTour` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tin_tuc`
--
ALTER TABLE `tin_tuc`
  MODIFY `MaTinTuc` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tours`
--
ALTER TABLE `tours`
  MODIFY `MaTour` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `don_hang`
--
ALTER TABLE `don_hang`
  ADD CONSTRAINT `don_hang_ibfk_1` FOREIGN KEY (`MaTour`) REFERENCES `tours` (`MaTour`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `don_hang_ibfk_2` FOREIGN KEY (`MaKhachHang`) REFERENCES `khach_hang` (`MaKhachHang`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `hinh_anh_tour`
--
ALTER TABLE `hinh_anh_tour`
  ADD CONSTRAINT `hinh_anh_tour_ibfk_1` FOREIGN KEY (`MaTour`) REFERENCES `tours` (`MaTour`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `noi_quy_tour`
--
ALTER TABLE `noi_quy_tour`
  ADD CONSTRAINT `noi_quy_tour_ibfk_1` FOREIGN KEY (`MaTour`) REFERENCES `tours` (`MaTour`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `thong_tin_tour`
--
ALTER TABLE `thong_tin_tour`
  ADD CONSTRAINT `thong_tin_tour_ibfk_1` FOREIGN KEY (`MaTour`) REFERENCES `tours` (`MaTour`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `thong_tin_tour_ibfk_2` FOREIGN KEY (`MaDiemDen`) REFERENCES `diem_den` (`MaDiemDen`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `tin_tuc`
--
ALTER TABLE `tin_tuc`
  ADD CONSTRAINT `tin_tuc_ibfk_1` FOREIGN KEY (`MaNhanVien`) REFERENCES `nhan_vien` (`MaNhanVien`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `tin_tuc_ibfk_2` FOREIGN KEY (`MaChuyenMuc`) REFERENCES `chuyen_muc` (`MaChuyenMuc`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `tours`
--
ALTER TABLE `tours`
  ADD CONSTRAINT `tours_ibfk_1` FOREIGN KEY (`MaNhanVien`) REFERENCES `nhan_vien` (`MaNhanVien`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `tours_ibfk_2` FOREIGN KEY (`MaDiemDen`) REFERENCES `diem_den` (`MaDiemDen`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
