// Nhập module cloudinary phiên bản v2
import { v2 as cloudinary } from 'cloudinary';

// Cấu hình cloudinary với các thông tin từ biến môi trường
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Tên cloud (lấy từ biến môi trường)
    api_key: process.env.CLOUDINARY_API_KEY,       // API key (lấy từ biến môi trường)
    api_secret: process.env.CLOUDINARY_API_SECRET, // API secret (lấy từ biến môi trường)
});

// Định nghĩa hàm upload hình ảnh lên Cloudinary
const uploadImageCloudinary = async (img) => {

    if(!img) throw new Error('Không có ảnh nào được tải lên !')
    // Chuyển đổi dữ liệu hình ảnh thành buffer
    const buffer = img?.buffer || Buffer.from(await img.arrayBuffer());

    // Tải hình ảnh lên Cloudinary bằng Promise
    const uploadImage = await new Promise((resolve, reject) => {
        // Sử dụng uploader.upload_stream để tải ảnh lên thư mục "UteStore"
        cloudinary.uploader.upload_stream({ folder: 'UteStore' }, (error, uploadResult) => {
            if (error) { // Kiểm tra nếu có lỗi xảy ra
               return reject(error); // Từ chối (reject) Promise với lỗi
            }
            return resolve(uploadResult); // Hoàn thành (resolve) Promise với kết quả upload
        }).end(buffer); // Kết thúc stream với dữ liệu buffer
    });

    // Trả về kết quả upload
    return uploadImage;
}

// Xuất hàm uploadImageCloudinary để sử dụng ở các module khác
export default uploadImageCloudinary;
