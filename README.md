# Ứng dụng Quản lý sửa chữa - DUE

Ứng dụng hỗ trợ các tổ chức quản lý quy trình sửa chữa thiết bị cơ sở vật chất chuyên nghiệp trên nền tảng di động.

## 🚀 Hướng dẫn phát hành ứng dụng (Deploy) chi tiết

Để ứng dụng có thể chạy trên điện thoại, bạn cần thực hiện qua 3 giai đoạn chính:

### Giai đoạn 1: Đưa mã nguồn lên GitHub
1. **Tạo tài khoản GitHub**: Truy cập [github.com](https://github.com/) và đăng ký nếu chưa có.
2. **Tạo Repository mới**: 
   - Nhấn nút **New** (màu xanh).
   - Đặt tên kho lưu trữ (ví dụ: `fixflow-due`).
   - Chọn **Public** và nhấn **Create repository**.
3. **Đẩy mã nguồn từ máy tính lên GitHub**:
   - Mở cửa sổ dòng lệnh (Terminal/Command Prompt) tại thư mục dự án này.
   - Chạy các lệnh sau theo thứ tự:
     ```bash
     git init
     git add .
     git commit -m "Phát hành phiên bản đầu tiên"
     git branch -M main
     git remote add origin <Dán-đường-link-GitHub-của-bạn-vào-đây>
     git push -u origin main
     ```

### Giai đoạn 2: Kết nối với Firebase App Hosting
1. **Truy cập Firebase Console**: Vào [console.firebase.google.com](https://console.firebase.google.com/).
2. **Tạo Dự án (Project)**: Nhấn **Add project**, đặt tên và nhấn **Continue** cho đến khi hoàn tất.
3. **Thiết lập App Hosting**:
   - Trong menu bên trái, chọn **Build** -> **App Hosting**.
   - Nhấn **Get Started** -> **Connect to GitHub**.
   - Firebase sẽ yêu cầu bạn cấp quyền truy cập vào tài khoản GitHub.
   - Chọn kho lưu trữ `fixflow-due` bạn vừa tạo ở Giai đoạn 1.
   - Tại mục **Deployment settings**, giữ nguyên các cài đặt mặc định và nhấn **Finish and Deploy**.
4. **Chờ đợi**: Firebase sẽ mất khoảng 3-5 phút để xây dựng ứng dụng. Khi hoàn tất, bạn sẽ thấy một đường link dạng `https://...apphosting.app`.

### Giai đoạn 3: Cài đặt vào điện thoại (PWA)
Khi đã có đường link chính thức từ Firebase:

- **Trên iPhone (Trình duyệt Safari)**:
  1. Truy cập link bằng Safari.
  2. Nhấn nút **Chia sẻ** (biểu tượng ô vuông có mũi tên hướng lên).
  3. Kéo xuống và chọn **"Thêm vào màn hình chính" (Add to Home Screen)**.
- **Trên Android (Trình duyệt Chrome)**:
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
