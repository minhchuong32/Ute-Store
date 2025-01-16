import jwt from 'jsonwebtoken'

const auth = async(request, response, next) => {
    try {
        // Lấy thông tin token từ cookie
        const accessToken = request.cookies.accessToken || request?.header?.authorization?.split(" ")[1];
        // Nếu không có token, trả về lỗi
        if (!accessToken) {
            return response.status(401).json({
                message: "Vui lòng đăng nhập để tiếp tục",
                success: false,
                error: true,
            });
        }
        // Giải mã token để lấy thông tin user
        const decoded = await jwt.verify(accessToken, process.env.SECRET_KEY_ACCESS_TOKEN);
        // Gán thông tin user vào request
        request.userId = decoded.id;
        // Chuyển hành động sang middleware hoặc controller tiếp theo
        next();
    } catch (error) {
        // Nếu có lỗi xảy ra, trả về lỗi cho người dùng
        console.error(error);
        return response.status(500).json({
            message: "Đã có lỗi xảy ra. Vui lòng thử lại sau",
            success: false,
            error: true,
        });
    }
}

export default auth;