# Ứng dụng Quản lý sửa chữa - DUE

Ứng dụng hỗ trợ các tổ chức quản lý quy trình sửa chữa thiết bị cơ sở vật chất chuyên nghiệp trên nền tảng di động.

## 🚀 Hướng dẫn chạy trên điện thoại (iPhone/Android)

Để có trải nghiệm như một ứng dụng thực thụ, bạn cần thực hiện 2 giai đoạn:

### Giai đoạn 1: Triển khai lên Firebase (Deploy)

1. **Firebase Console**: Truy cập [console.firebase.google.com](https://console.firebase.google.com/) và tạo một dự án mới.
2. **Kích hoạt App Hosting**: 
   - Trong menu bên trái, tìm **Build** -> **App Hosting**.
   - Nhấn **Get Started** và kết nối với kho chứa mã nguồn (GitHub/GitLab) của bạn.
   - Firebase sẽ tự động nhận diện ứng dụng Next.js và tiến hành build.
3. **Cấu hình Config**:
   - Sau khi tạo xong "Web App" trong Firebase, hãy copy các thông số trong `firebaseConfig` dán vào tệp `src/firebase/config.ts` trong mã nguồn của bạn.

### Giai đoạn 2: Cài đặt vào điện thoại (PWA)

Khi đã có đường link `https://...` từ Firebase:

- **Trên iPhone (Safari)**:
  1. Truy cập vào link bằng Safari.
  2. Nhấn nút **Chia sẻ** (biểu tượng ô vuông có mũi tên lên).
  3. Chọn **"Thêm vào màn hình chính" (Add to Home Screen)**.
- **Trên Android (Chrome)**:
  1. Truy cập vào link bằng Chrome.
  2. Nhấn dấu **3 chấm** ở góc trên bên phải.
  3. Chọn **"Cài đặt ứng dụng"** hoặc **"Thêm vào màn hình chính"**.

## 🔑 Tài khoản thử nghiệm
- **Người yêu cầu**: `requester` / `123456`
- **Lãnh đạo đơn vị**: `leader` / `123456`
- **Quản lý CSVC**: `manager` / `123456`
- **Kỹ thuật viên**: `tech` / `123456`

---
*© 2026 Hệ thống quản lý sửa chữa v1.0 • Phát triển bởi Phòng Cơ sở vật chất*
