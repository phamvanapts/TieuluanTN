// Cập nhật thư viện
import path from "path";
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";

// Thêm các file
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import {
    notFound,
    errorHandler
} from "./middleware/errorMiddleware.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// ---------------
dotenv.config(); // Sử dụng biến môi trường

// Kết nối cơ sở dữ liệu MongoDB từ config/db.js
connectDB();

// Sử dụng express
const studionhu = express();

/**
 * Thư viện ejs
 */
import ejs from 'ejs';
studionhu.set('view engine', 'ejs');
/*
 * Công  cụ ghi logger trong quá trình phát triển ứng dụng
 * pva cập nhật và cài đặt trong dev
*/
if (process.env.NODE_ENV === "development") {
    studionhu.use(morgan("dev"));
}

// Tạo Json
studionhu.use(express.json());

/**
 * Tạo trang tĩnh
 * 
 */
studionhu.use(express.static('public'));
//route chính
studionhu.get("/", (req, res) => {
    // res.sendFile(path.resolve(__dirname, 'index.html'));
    res.render('index');
});

// Các route của chương trình
studionhu.use("/api/products", productRoutes); //Sản phẩm
studionhu.use("/api/users", userRoutes);       //người dùng
studionhu.use("/api/orders", orderRoutes);     //đặt hàng
studionhu.use("/api/upload", uploadRoutes);    //cập nhật

// route thanh toán
studionhu.get("/api/config/paypal", (req, res) =>
    res.send(process.env.PAYPAL_CLIENT_ID)
);

// đường dẫn 
const __dirname = path.resolve();
studionhu.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Không tìm thấy route
studionhu.use(notFound);

// Lỗi khi đọc dữ liệu từ các route
studionhu.use(errorHandler);

/*
 * Port hoạt động của ứng dụng. 
 * Sử dụng biến nôi trường hoặc giá trị biến 3300
 *
 */
const PORT = process.env.PORT || 3300;
/**
 * Khi ứng dụng chạy sẽ lắng nghe ở cổng được cài đặt
 * In ra màn hình console cổng đang hoạt động
 * Định dạng màu và font đậm
 */
studionhu.listen(
    PORT,
    console.clear(),
    console.log(`================================`.red),
    console.log(
        `| Tiểu luận tốt đại học !      |`.yellow
            .bold
    ),
    console.log(`| Đề tài: WEBSITE STUDIO NHƯ ! |`
        .red.bold
    ),
    console.log(`| Hướng dẫn: TS.LÂM NHỰT KHANG |`.green),
    console.log(`| Thực hiện: PHẠM VĂN Á        |`),
    console.log(`| MSSV: cm21v7x306             |`),
    console.log(`|------------------------------|`.red),
    console.log(`| PORT: ${PORT}                   |`),
    console.log(`================================`.red),
    // console.log(path.resolve(__dirname, '/views/index.html')),
);
/**
 * Thực hiện: PhamVanA
 * Ngày tạo: 19/3/2024
 */