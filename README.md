# Ứng dụng Quản lý sửa chữa - DUE

Ứng dụng hỗ trợ các tổ chức quản lý quy trình sửa chữa thiết bị cơ sở vật chất chuyên nghiệp trên nền tảng di động.

## 🚀 Hướng dẫn chi tiết cách đưa App lên điện thoại (Deploy)

### Giai đoạn 1: Đưa mã nguồn lên GitHub (Đã hoàn thành ✅)
Bạn đã thực hiện xong việc đẩy code lên GitHub. Bây giờ code của bạn đã an toàn trên đám mây.

### Giai đoạn 2: Kết nối với Firebase App Hosting (Đang thực hiện 🕒)
Đây là bước quan trọng để biến code trên GitHub thành một trang web có địa chỉ `https://...` để bạn có thể truy cập từ điện thoại.

1. **Vào Firebase Console**: Truy cập [console.firebase.google.com](https://console.firebase.google.com/).
2. **Tạo dự án**: Nhấn **Add project**, đặt tên (ví dụ: `fixflow-due`) và nhấn **Continue**.
3. **Thiết lập App Hosting**:
   - Ở menu bên trái, tìm mục **Build** -> **App Hosting**.
   - Nhấn **Get Started**.
4. **Kết nối GitHub**:
   - Firebase sẽ yêu cầu bạn kết nối với tài khoản GitHub.
   - Sau khi kết nối, hãy chọn đúng kho lưu trữ (Repository) tên là `fixflow-due` mà bạn vừa tạo.
5. **Cấu hình và Triển khai**:
   - Giữ các cài đặt mặc định.
   - Nhấn **Finish and Deploy**.
6. **Đợi hoàn tất**: Firebase sẽ mất khoảng 3-5 phút để xây dựng ứng dụng lần đầu. Khi xong, bạn sẽ thấy một đường link (ví dụ: `https://fixflow-due.apphosting.app`).

### Giai đoạn 3: Cài đặt vào điện thoại (Bước cuối cùng 📱)
Mở điện thoại của bạn, dùng trình duyệt để truy cập vào đường link bạn nhận được ở bước trên:

- **Trên iPhone (Safari)**: 
  1. Nhấn biểu tượng **Chia sẻ** (hình ô vuông có mũi tên lên ở dưới cùng).
  2. Cuộn xuống và chọn **"Thêm vào màn hình chính" (Add to Home Screen)**.
- **Trên Android (Chrome)**: 
  1. Nhấn vào dấu **3 chấm** ở góc trên bên phải.
  2. Chọn **"Cài đặt ứng dụng"** hoặc **"Thêm vào màn hình chính"**.

---

## 🔑 Tài khoản thử nghiệm (Mật khẩu: 123456)
- **Người yêu cầu**: `requester`
- **Lãnh đạo đơn vị**: `leader`
- **Quản lý CSVC**: `manager`
- **Kỹ thuật viên**: `tech`

*© 2026 Hệ thống quản lý sửa chữa v1.0 • Phát triển bởi Phòng Cơ sở vật chất*
