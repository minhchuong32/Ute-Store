import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import sendEmail from "../config/semdEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";

// Hàm đăng ký người dùng
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

// Hàm xác thực email người dùng
export async function verifyEmailController(request, response) {
    try {
        // Lấy mã xác thực
        const { code } = request.body;

        // Kiểm tra xem mã xác thực có tồn tại hay không
        if (!code) {
            return response.status(400).json({
                message: "Mã xác thực không hợp lệ",
                success: false,
                error: true,
            });
        }

        // Tìm người dùng theo ID trong cơ sở dữ liệu: xac thuc email
        const user = await UserModel.findById(code);

        // Kiểm tra xem người dùng có tồn tại hay không
        if (!user) {
            return response.status(404).json({
                message: "Không tìm thấy người dùng",
                success: false,
                error: true,
            });
        }

        // Cập nhật trạng thái xác thực email của người dùng thành true
        user.verify_email = true;

        // Lưu thông tin người dùng đã cập nhật
        const save = await user.save();

        // Trả về phản hồi thành công cho người dùng
        return response.json({
            message: "Xác thực email thành công",
            success: true,
            error: false,
            data: save,
        });
    } catch (error) {
        // Xử lý lỗi nếu có bất kỳ ngoại lệ nào xảy ra trong quá trình
        console.error(error); // In lỗi ra console
        return response.status(500).json({
            message: "Đã có lỗi xảy ra. Vui lòng thử lại sau",
            success: false,
            error: true,
        });
    }
}

// Hàm đăng nhập người dùng
export async function loginUserController(request, response) {
    try {
        // Lấy dữ liệu người dùng từ request body (email, mật khẩu)
        const { email, password } = request.body;

        // Kiểm tra xem người dùng đã cung cấp đầy đủ thông tin chưa
        if (!email || !password) {
            return response.status(400).json({
                message: "Vui lòng điền đầy đủ thông tin",
                success: false,
                error: true,
            });
        }

        // Tìm người dùng theo email trong cơ sở dữ liệu
        const user = await UserModel.findOne({ email });

        // Kiểm tra xem người dùng có tồn tại hay không
        if (!user) {
            return response.status(404).json({
                message: "Email không tồn tại",
                success: false,
                error: true,
            });
        }

        // Kiểm tra xem người dùng đã xác thực email chưa
        if (!user.verify_email) {
            return response.status(400).json({
                message: "Vui lòng xác thực email trước khi đăng nhập",
                success: false,
                error: true,
            });
        }

        // Kiểm tra xem tài khoản người dùng có bị vô hiệu hóa hay không
        if (user.status === "Inactive") {
            return response.status(400).json({
                message: "Tài khoản của bạn đã bị vô hiệu hóa",
                success: false,
                error: true,
            });
        }

        // Kiểm tra xem tài khoản người dùng có bị tạm ngưng hay không
        if (user.status === "Suspended") {
            return response.status(400).json({
                message: "Tài khoản của bạn đã bị tạm ngưng",
                success: false,
                error: true,
            });
        }

        if (user.status === "Active") {
            // Cập nhật ngày đăng nhập lần cuối của người dùng
            user.last_login_date = new Date();
            await user.save();
        }

        // Kiểm tra xem mật khẩu người dùng có khớp với mật khẩu đã mã hóa trong cơ sở dữ liệu hay không
        const checkPass = await bcryptjs.compare(password, user.password);

        // Nếu mật khẩu không khớp, trả về thông báo lỗi
        if (!checkPass) {
            return response.status(400).json({
                message: "Mật khẩu không chính xác",
                success: false,
                error: true,
            });
        }

        // Tạo mã token truy cập và làm mới
        const accessToken = await generatedAccessToken(user._id);
        const refreshToken = await generatedRefreshToken(user._id);
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        }
        response.cookie("accessToken", accessToken, cookiesOption);
        response.cookie("refreshToken", refreshToken, cookiesOption);

        // Trả về phản hồi thành công cho người dùng
        return response.json({
            message: "Đăng nhập thành công",
            success: true,
            error: false,
            data: user,
        });
    } catch (error) {
        // Xử lý lỗi nếu có bất kỳ ngoại lệ nào xảy ra trong quá trình
        console.error(error); // In lỗi ra console
        return response.status(500).json({
            message: "Đã có lỗi xảy ra. Vui lòng thử lại sau",
            success: false,
            error: true,
        });
    }
}

// Hàm đăng xuất người dùng 
export async function logoutUserController(request, response) {
    try {



        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        }

        response.clearCookie("accessToken", cookiesOption);
        response.clearCookie("refreshToken", cookiesOption);
        
        const removeRefreshToken = await UserModel.findByIdAndUpdate(request.userId, {
            refresh_token : ""
        })

        return response.json({
            message: "Đăng xuất thành công",
            success: true,
            error: false,
        });
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({
            message: "Đã có lỗi xảy ra. Vui lòng thử lại sau",
            success: false,
            error: true,
        });
    }
}

// Định nghĩa hàm controller để xử lý việc tải ảnh đại diện
export async function uploadAvatarController(request, response) {
    try {
        // Lấy userId từ request (được truyền khi người dùng đăng nhập)
        const userId = request.userId;

        // Lấy file hình ảnh từ request (được tải lên từ client)
        const image = request.file;

        // Gọi hàm uploadImageCloudinary để tải hình ảnh lên Cloudinary
        const upload = await uploadImageCloudinary(image);

        // Cập nhật thông tin người dùng trong cơ sở dữ liệu với link avatar mới
        const updateUser = await UserModel.findByIdAndUpdate(userId, {
            avatar: upload.url // Lưu URL của hình ảnh đã tải lên
        });

        // Trả về phản hồi thành công với thông tin cập nhật
        return response.json({
            message: "Tải ảnh thành công", // Thông báo cho người dùng
            success: true,                 // Trạng thái thành công
            error: false,                  // Không có lỗi
            data: {
                _id: userId,               // ID của người dùng
                avatar: upload.url,        // Link ảnh đại diện mới
            }
        });
    } catch (error) {
        // Ghi lại lỗi để kiểm tra nếu có sự cố xảy ra
        console.error(error);

        // Trả về phản hồi lỗi cho client
        return response.status(500).json({
            message: "Đã có lỗi xảy ra. Vui lòng thử lại sau", // Thông báo lỗi
            success: false,                                   // Trạng thái thất bại
            error: true,                                      // Đánh dấu có lỗi
        });
    }
}

