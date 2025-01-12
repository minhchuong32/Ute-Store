// Import thư viện mongoose để làm việc với MongoDB
import mongoose from 'mongoose';

// Định nghĩa schema (cấu trúc dữ liệu) cho đối tượng người dùng
const userSchema = new mongoose.Schema({
    // Tên người dùng (bắt buộc nhập)
    name: {
        type: String, // Kiểu dữ liệu chuỗi
        required: [true, "Cung cấp tên người dùng"], // Bắt buộc phải có, nếu thiếu sẽ hiển thị thông báo lỗi
    },
    // Email người dùng (bắt buộc và duy nhất)
    email: {
        type: String,
        required: [true, "Cung cấp email người dùng"], // Bắt buộc phải có
        unique: true, // Giá trị phải là duy nhất, không trùng lặp
    },
    // Mật khẩu người dùng (bắt buộc)
    password: {
        type: String,
        required: [true, "Cung cấp mật khẩu người dùng"], // Bắt buộc phải có
    },
    // Avatar người dùng (không bắt buộc, giá trị mặc định là chuỗi rỗng)
    avatar: {
        type: String,
        default: "",
    },
    // Số điện thoại (không bắt buộc, giá trị mặc định là null)
    mobile: {
        type: Number,
        default: null,
    },
    // Token để làm mới (refresh token)
    refresh_token: {
        type: String,
        default: "",
    },
    // Trạng thái xác thực email (true: đã xác thực, false: chưa xác thực)
    verify_email: {
        type: Boolean,
        default: false,
    },
    // Ngày đăng nhập lần cuối
    last_login_date: {
        type: Date,
        default: "", // Giá trị mặc định là rỗng
    },
    // Trạng thái tài khoản (Active, Inactive, Suspended)
    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"], // Chỉ cho phép một trong các giá trị này
        default: "Active", // Giá trị mặc định là Active
    },
    // Chi tiết địa chỉ của người dùng (liên kết tới collection "address")
    address_details: [{
        type: mongoose.Schema.ObjectId, // Tham chiếu tới ObjectId trong MongoDB
        ref: "address", // Liên kết tới model "address"
    }],
    // Danh sách sản phẩm trong giỏ hàng (liên kết tới collection "cartProduct")
    shopping_cart: [{
        type: mongoose.Schema.ObjectId,
        ref: "cartProduct",
    }],
    // Lịch sử đơn hàng (liên kết tới collection "order")
    orderHistory: [{
        type: mongoose.Schema.ObjectId,
        ref: "order",
    }],
    // Mã OTP dùng để khôi phục mật khẩu
    forgot_password_otp: {
        type: String,
        default: null,
    },
    // Thời gian hết hạn của mã OTP
    forgot_password_expiry: {
        type: Date,
        default: "",
    },
    // Vai trò người dùng (ADMIN hoặc USER)
    role: {
        type: String,
        enum: ["ADMIN", "USER"], // Chỉ chấp nhận hai giá trị: ADMIN hoặc USER
        default: "USER", // Giá trị mặc định là USER
    }
}, {
    // Tự động thêm các trường createdAt và updatedAt vào schema
//     MongoDB sẽ tự động:
// Thêm trường createdAt khi tài liệu được tạo.
// Thêm hoặc cập nhật trường updatedAt mỗi khi tài liệu được sửa đổi.
    timestamps: true
});

// Tạo model "User" từ schema đã định nghĩa
const User = mongoose.model("User", userSchema);

// Xuất model "User" để sử dụng ở các nơi khác
export default User;
