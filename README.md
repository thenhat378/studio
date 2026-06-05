# Ứng dụng Quản lý sửa chữa - DUE

Ứng dụng hỗ trợ các tổ chức quản lý quy trình sửa chữa thiết bị cơ sở vật chất chuyên nghiệp trên nền tảng di động.

## 🚀 Hướng dẫn chi tiết cách đưa App lên điện thoại (Deploy)

Để ứng dụng chạy được trên điện thoại, bạn cần thực hiện 3 giai đoạn chính sau đây:

### Giai đoạn 0: Tải mã nguồn về máy tính
Trước khi thực hiện các bước bên dưới, bạn cần có mã nguồn này trên máy tính của mình:
1. Tìm nút **Download Project** hoặc **Export** trên giao diện này để tải toàn bộ code về.
2. Giải nén tệp tin vừa tải về vào một thư mục trên máy tính (ví dụ: ổ `D:\RepairApp`). Đây chính là **"Thư mục dự án"**.

### Giai đoạn 1: Đưa mã nguồn lên GitHub (Lưu trữ code)
Đây là bước đưa toàn bộ tệp tin của app từ máy tính của bạn lên trang web GitHub.

1. **Tạo tài khoản GitHub**: Truy cập [github.com](https://github.com/) và đăng ký.
2. **Tạo "Kho lưu trữ" (Repository) mới**:
   - Nhấn nút **New** (màu xanh).
   - **Repository name**: Đặt tên là `fixflow-due`.
   - Chọn **Public**.
   - Nhấn **Create repository**.
3. **Đẩy code lên GitHub**:
   - Mở thư mục dự án trên máy tính của bạn.
   - Mở cửa sổ **Terminal** (hoặc Command Prompt/Git Bash) ngay tại thư mục đó.
   - Chạy lần lượt các lệnh sau:
     ```bash
     git init
     git add .
     git commit -m "Phát hành bản đầu tiên"
     git branch -M main
     git remote add origin <Dán-đường-link-GitHub-của-bạn-vào-đây>
     git push -u origin main
     ```

### Giai đoạn 2: Kết nối với Firebase App Hosting (Đưa app lên mạng)
1. **Truy cập Firebase**: Vào [console.firebase.google.com](https://console.firebase.google.com/).
2. **Tạo dự án**: Nhấn **Add project**, đặt tên và nhấn **Continue**.
3. **Thiết lập App Hosting**:
   - Menu trái: **Build** -> **App Hosting**.
   - Nhấn **Get Started** -> Chọn **Connect to GitHub**.
   - Chọn tài khoản GitHub và chọn đúng kho lưu trữ `fixflow-due`.
   - Nhấn **Finish and Deploy**.
4. **Đợi hoàn tất**: Sau vài phút, Firebase sẽ cấp cho bạn một đường link (ví dụ: `https://fixflow-due.apphosting.app`).

### Giai đoạn 3: Cài đặt vào điện thoại (Biến web thành App)
Mở điện thoại và truy cập vào đường link bạn nhận được ở Giai đoạn 2:

- **Trên iPhone (Safari)**: Nhấn biểu tượng **Chia sẻ** (ô vuông mũi tên lên) -> Chọn **"Thêm vào màn hình chính"**.
- **Trên Android (Chrome)**: Nhấn **3 chấm** -> Chọn **"Cài đặt ứng dụng"**.

---

## 🔑 Tài khoản thử nghiệm (Mật khẩu: 123456)
- **Người yêu cầu**: `requester`
- **Lãnh đạo đơn vị**: `leader`
- **Quản lý CSVC**: `manager`
- **Kỹ thuật viên**: `tech`

*© 2026 Hệ thống quản lý sửa chữa v1.0 • Phát triển bởi Phòng Cơ sở vật chất*
