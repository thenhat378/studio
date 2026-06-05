# Ứng dụng Quản lý sửa chữa - DUE

Ứng dụng hỗ trợ các tổ chức quản lý quy trình sửa chữa thiết bị cơ sở vật chất chuyên nghiệp trên nền tảng di động.

## 🚀 Hướng dẫn phát hành ứng dụng lên điện thoại

Để ứng dụng có thể chạy trên điện thoại, bạn cần thực hiện 2 giai đoạn: Đưa mã nguồn lên GitHub và kết nối với Firebase.

### Giai đoạn 1: Đưa mã nguồn lên GitHub

1. **Tạo Repository**: Truy cập [github.com](https://github.com/) và tạo một kho lưu trữ (Repository) mới (ví dụ: `fixflow-due`).
2. **Mở Terminal tại thư mục dự án**:
   - Nếu chưa có git: `git init`
   - Thêm các tệp: `git add .`
   - Cam kết mã nguồn: `git commit -m "Initial commit"`
3. **Đẩy mã nguồn lên**:
   - Kết nối với GitHub: `git remote add origin <đường-link-github-của-bạn>`
   - Đẩy lên nhánh chính: `git push -u origin main`

### Giai đoạn 2: Kết nối với Firebase App Hosting

1. **Firebase Console**: Truy cập [console.firebase.google.com](https://console.firebase.google.com/) và tạo dự án mới.
2. **Thiết lập App Hosting**:
   - Vào menu **Build** -> **App Hosting**.
   - Nhấn **Get Started** -> **Connect to GitHub**.
   - Chọn tài khoản GitHub và kho lưu trữ `fixflow-due` bạn vừa tạo.
3. **Cấu hình**:
   - Firebase sẽ tự động nhận diện Next.js.
   - Nhấn **Finish and Deploy**. Firebase sẽ bắt đầu quá trình xây dựng (build) và cho bạn một đường link `https://...` sau vài phút.

### Giai đoạn 3: Cài đặt vào điện thoại (PWA)

Khi đã có đường link chính thức từ Firebase:

- **Trên iPhone (Safari)**:
  1. Truy cập link bằng Safari.
  2. Nhấn nút **Chia sẻ** (ô vuông có mũi tên lên).
  3. Chọn **"Thêm vào màn hình chính" (Add to Home Screen)**.
- **Trên Android (Chrome)**:
  1. Truy cập link bằng Chrome.
  2. Nhấn dấu **3 chấm** ở góc trên bên phải.
  3. Chọn **"Cài đặt ứng dụng"** hoặc **"Thêm vào màn hình chính"**.

## 🔑 Tài khoản thử nghiệm (Mật khẩu: 123456)
- **Người yêu cầu**: `requester`
- **Lãnh đạo đơn vị**: `leader`
- **Quản lý CSVC**: `manager`
- **Kỹ thuật viên**: `tech`

---
*© 2026 Hệ thống quản lý sửa chữa v1.0 • Phát triển bởi Phòng Cơ sở vật chất*
