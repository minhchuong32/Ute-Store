const verifyEmailTemplate = ({ name, url }) => {
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
        <h2 style="color: #4CAF50;">Xin chào, ${name}!</h2>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>Ute Store</strong>.</p>
        <p>Để hoàn tất việc xác thực email, vui lòng nhấn vào liên kết bên dưới:</p>
        <a href="${url}" 
           style="display: inline-block; padding: 10px 20px; margin: 10px 0; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
           Xác thực email
        </a>
        <p>Nếu nút không hoạt động, bạn có thể sao chép và dán liên kết này vào trình duyệt của mình:</p>
        <p><a href="${url}" style="color: #4CAF50;">${url}</a></p>
        <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
        <p style="font-size: 12px; color: #777;">Nếu bạn không yêu cầu xác thực email, vui lòng bỏ qua email này.</p>
        <p style="font-size: 12px; color: #777;">Trân trọng, <br> Đội ngũ hỗ trợ của Ute Store.</p>
    </div>
    `;
};

export default verifyEmailTemplate