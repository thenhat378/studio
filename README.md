# Ứng dụng Quản lý sửa chữa - DUE

Ứng dụng hỗ trợ các tổ chức quản lý quy trình sửa chữa thiết bị cơ sở vật chất chuyên nghiệp trên nền tảng di động.

## 🚀 Hướng dẫn Đưa App lên điện thoại (Deploy)

### Giai đoạn 1: Đưa mã nguồn lên GitHub (Đã hoàn thành ✅)

---

### Giai đoạn 2: Kết nối với Firebase App Hosting (Thực hiện trên máy tính)
Đây là bước biến code trên GitHub thành một trang web có địa chỉ `https://...` để truy cập từ điện thoại.

1.  **Vào Firebase Console**: Truy cập [console.firebase.google.com](https://console.firebase.google.com/).
2.  **Tạo dự án**: 
    - Nhấn **Add project**.
    - Đặt tên (ví dụ: `fixflow-due`). 
    - Nhấn **Continue** (Tiếp tục) cho đến khi vào được bảng điều khiển chính.
3.  **Bắt đầu với App Hosting**:
    - Ở cột menu bên trái, tìm mục **Build** (Xây dựng) -> chọn **App Hosting**.
    - Nhấn nút **Get Started**.
4.  **Kết nối GitHub**:
    - Nhấn nút **Connect to GitHub**. Một cửa sổ hiện ra yêu cầu bạn cho phép Firebase truy cập GitHub của bạn. Hãy xác nhận.
    - Sau khi kết nối, ở mục **Select Repository**, hãy chọn đúng tên kho lưu trữ bạn đã tạo ở Giai đoạn 1 (ví dụ: `your-username/fixflow-due`).
5.  **Cài đặt nhánh (Branch)**:
    - Mục **Branch**: Chọn `main`.
    - Nhấn **Next**.
6.  **Cấu hình Backend**:
    - **Backend ID**: Bạn có thể đặt tên bất kỳ (ví dụ: `web-app`).
    - **Deployment settings**: Giữ nguyên mặc định.
    - Nhấn **Finish and Deploy**.
7.  **Theo dõi tiến trình**:
    - Bạn sẽ thấy một màn hình trạng thái ghi "Deployment in progress". 
    - Firebase sẽ mất khoảng 3-5 phút để tự động tải code, cài đặt và chạy ứng dụng.
    - Khi hoàn tất, bạn sẽ thấy một đường link màu xanh hiện ra (ví dụ: `https://...apphosting.app`). Đây chính là địa chỉ App của bạn!

---

### Giai đoạn 3: Cài đặt vào điện thoại (Bước cuối cùng 📱)
Gửi đường link bạn nhận được ở bước trên vào điện thoại (qua Zalo, Messenger hoặc Email), sau đó mở link bằng trình duyệt:

- **Trên iPhone (Dùng Safari)**: 
  1. Nhấn biểu tượng **Chia sẻ** (hình ô vuông có mũi tên lên ở thanh dưới cùng).
  2. Cuộn xuống và chọn **"Thêm vào màn hình chính" (Add to Home Screen)**.
  3. Nhấn **Thêm**.
- **Trên Android (Dùng Chrome)**: 
  1. Nhấn vào dấu **3 chấm** ở góc trên bên phải.
  2. Chọn **"Cài đặt ứng dụng"** hoặc **"Thêm vào màn hình chính"**.

---

## 🔑 Tài khoản thử nghiệm (Mật khẩu: 123456)
- **Người yêu cầu**: `requester`
- **Lãnh đạo đơn vị**: `leader`
- **Quản lý CSVC**: `manager`
- **Kỹ thuật viên**: `tech`

*© 2026 Hệ thống quản lý sửa chữa v1.0 • Phát triển bởi Phòng Cơ sở vật chất*
