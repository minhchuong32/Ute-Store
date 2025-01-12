import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import sendEmail from "../config/semdEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";

export async function registerUserController(request, response) {
    try {
        // Lấy dữ liệu người dùng từ request body (tên, email, mật khẩu)
        const { name, email, password } = request.body;

        // Kiểm tra xem người dùng đã cung cấp đầy đủ thông tin chưa
        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Vui lòng điền đầy đủ thông tin", // Thông báo nếu thiếu thông tin
                success: false, // Trạng thái không thành công
                error: true, // Cờ lỗi
            });
        }

        // Kiểm tra xem email người dùng có đã tồn tại trong cơ sở dữ liệu hay chưa
        const user = await UserModel.findOne({ email });
        if (user) {
            return response.status(400).json({
                message: "Email đã tồn tại", // Thông báo nếu email đã có người sử dụng
                success: false,
                error: true,
            });
        }

        // Tạo "salt" ngẫu nhiên để bảo vệ mật khẩu, với độ bảo mật là 10 vòng lặp
        const salt = await bcryptjs.genSalt(10);

        // Mã hóa mật khẩu người dùng bằng salt đã tạo
        const hashPassword = await bcryptjs.hash(password, salt);

        // Tạo đối tượng payload chứa thông tin người dùng (bao gồm mật khẩu đã được mã hóa)
        const payload = {
            name, // Tên người dùng
            email, // Email người dùng
            password: hashPassword, // Mật khẩu đã mã hóa
        };

        // Tạo người dùng mới từ payload và lưu vào cơ sở dữ liệu
        const newUser = new UserModel(payload);
        const save = await newUser.save(); 

        // Tạo URL xác minh email, sử dụng ID người dùng vừa lưu để tạo mã xác thực
        const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

        // Gửi email xác minh đến người dùng với URL xác thực
        const verifyEmail = await sendEmail({
            sendTo: email, // Địa chỉ email người dùng
            subject: "Xác thực email từ Ute Store", // Tiêu đề email
            html: verifyEmailTemplate({
                // Nội dung email sử dụng template đã tạo trước đó
                name,
                url: verifyEmailUrl, // Đưa URL xác thực vào email
            }),
        });

        // Trả về phản hồi thành công cho người dùng
        return response.json({
            message: "Đăng ký tài khoản thành công, vui lòng kiểm tra email để xác thực", // Thông báo cho người dùng
            success: true, // Trạng thái thành công
            error: false, // Không có lỗi
            data: save, // Trả về thông tin người dùng đã lưu
        });
    } catch (error) {
        // Xử lý lỗi nếu có bất kỳ ngoại lệ nào xảy ra trong quá trình
        console.error(error); // In lỗi ra console
        return response.status(500).json({
            message: "Đã có lỗi xảy ra. Vui lòng thử lại sau", // Thông báo lỗi chung
            success: false, // Trạng thái không thành công
            error: true, // Cờ lỗi
        });
    }
}
