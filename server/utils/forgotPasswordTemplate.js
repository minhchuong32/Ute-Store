const forgotPasswordTemplate = ({ name, otp }) => {
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <p>Xin chào ${name || 'Người dùng'},</p>
        <p>Mã xác thực (OTP) của bạn là:</p>
        <h2 style="color: #1a73e8; text-align: center;">${otp}</h2>
        <p>Mã OTP này chỉ có hiệu lực trong một khoảng thời gian ngắn. Vui lòng không chia sẻ với bất kỳ ai.</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        <p>Trân trọng, <br/> Đội ngũ hỗ trợ</p>
    </div>
    `;
};

export default forgotPasswordTemplate;