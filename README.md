
# Ứng dụng Quản lý sửa chữa - DUE

Ứng dụng hỗ trợ các tổ chức quản lý quy trình sửa chữa thiết bị cơ sở vật chất một cách chuyên nghiệp và hiệu quả trên nền tảng di động.

## Các tính năng chính:
- **Đăng nhập Bảo mật**: Hỗ trợ đổi mật khẩu lần đầu, quên mật khẩu.
- **Tạo Phiếu Yêu cầu Thông minh**: Tích hợp AI hỗ trợ phân tích sự cố và gợi ý thiết bị.
- **Quy trình Phê duyệt Đa cấp**: Đơn vị yêu cầu -> Lãnh đạo đơn vị -> Quản lý CSVC -> Nhân viên kỹ thuật.
- **Báo cáo & Nghiệm thu**: Kỹ thuật viên báo cáo kết quả, người dùng nghiệm thu trực tiếp trên app.
- **Tổng quan hệ thống**: Hiển thị tổng quan các chỉ số hoạt động và hiệu suất kỹ thuật viên.
- **Danh mục Thiết bị**: Quản lý tập trung các thiết bị (Bàn ghế, Máy chiếu, Cáp HDMI, VGA...).
- **In phiếu (PDF)**: Xuất báo cáo để lưu trữ bản cứng chính thức.

## Vai trò trong hệ thống:
1. **Người yêu cầu** (requester): Tạo phiếu, theo dõi và nghiệm thu.
2. **Lãnh đạo đơn vị** (leader): Phê duyệt hoặc từ chối yêu cầu từ nhân viên trong đơn vị.
3. **Quản lý CSVC** (manager): Phân công kỹ thuật viên xử lý và duyệt hoàn thành kỹ thuật.
4. **Kỹ thuật viên** (tech): Nhận nhiệm vụ, cập nhật tiến độ, báo cáo hoàn thành và in phiếu.

## Hướng dẫn Deploy (Phát hành ứng dụng)

Để chạy ứng dụng trên điện thoại, bạn cần deploy lên một máy chủ web. Cách đơn giản nhất là dùng **Firebase**:

### Bước 1: Cài đặt Firebase CLI
Nếu chưa có, hãy cài đặt công cụ dòng lệnh của Firebase trên máy tính:
```bash
npm install -g firebase-tools
```

### Bước 2: Đăng nhập và Khởi tạo
Mở terminal tại thư mục dự án và chạy:
```bash
firebase login
firebase init
```
- Chọn **Hosting** hoặc **App Hosting** (Khuyên dùng App Hosting cho Next.js).
- Chọn project Firebase của bạn.
- Thiết lập thư mục public là `.next` (đối với App Hosting hệ thống sẽ tự nhận diện).

### Bước 3: Deploy
Chạy lệnh sau để tải ứng dụng lên mạng:
```bash
npm run build
firebase deploy
```

### Bước 4: Cài đặt lên điện thoại (PWA)
Sau khi có đường link `https://...`, hãy mở link đó trên:
- **iPhone (Safari)**: Nhấn nút **Chia sẻ** -> **Thêm vào màn hình chính**.
- **Android (Chrome)**: Nhấn **3 chấm** -> **Cài đặt ứng dụng**.

---
*© 2026 Hệ thống quản lý sửa chữa v1.0 • Phát triển bởi Phòng Cơ sở vật chất*
