# Ứng dụng Quản lý sửa chữa - DUE

Ứng dụng hỗ trợ các tổ chức quản lý quy trình sửa chữa thiết bị cơ sở vật chất chuyên nghiệp trên nền tảng di động.

## 🚀 Hướng dẫn chi tiết cách đưa App lên điện thoại (Deploy)

Để ứng dụng chạy được trên điện thoại, bạn cần thực hiện 3 giai đoạn chính sau đây:

### Giai đoạn 1: Đưa mã nguồn lên GitHub (Lưu trữ code)
Đây là bước đưa toàn bộ tệp tin của app lên trang web GitHub.

1. **Tạo tài khoản GitHub**:
   - Truy cập [github.com](https://github.com/) và đăng ký một tài khoản miễn phí.
2. **Tạo "Kho lưu trữ" (Repository) mới**:
   - Sau khi đăng nhập, nhìn bên trái màn hình có nút **New** màu xanh (hoặc dấu **+** ở góc trên cùng bên phải -> chọn **New repository**).
   - **Repository name**: Đặt tên cho app (ví dụ: `fixflow-due`).
   - **Public/Private**: Nên chọn **Public**.
   - Nhấn nút **Create repository** ở dưới cùng.
3. **Đẩy code lên GitHub (Thực hiện trên máy tính của bạn)**:
   - Mở thư mục chứa code này trên máy tính.
   - Chuột phải vào vùng trống trong thư mục, chọn **Open in Terminal** (hoặc **Open Git Bash here**).
   - Copy và dán từng lệnh sau vào cửa sổ đen (Terminal) đó:
     ```bash
     git init
     git add .
     git commit -m "Phát hành bản đầu tiên"
     git branch -M main
     git remote add origin <Dán-đường-link-GitHub-vừa-tạo-vào-đây>
     git push -u origin main
     ```
     *(Lưu ý: Nếu GitHub yêu cầu đăng nhập ở bước này, hãy làm theo hướng dẫn trên màn hình của họ)*.

### Giai đoạn 2: Kết nối với Firebase App Hosting (Đưa app lên mạng)
Đây là bước biến code trên GitHub thành một trang web có link truy cập được.

1. **Truy cập Firebase**: Vào [console.firebase.google.com](https://console.firebase.google.com/).
2. **Tạo dự án**: Nhấn **Add project**, đặt tên bất kỳ và cứ nhấn **Continue** cho đến khi xong.
3. **Thiết lập App Hosting**:
   - Ở menu bên trái, tìm mục **Build** -> chọn **App Hosting**.
   - Nhấn **Get Started** -> Chọn **Connect to GitHub**.
   - Firebase sẽ mở một cửa sổ nhỏ, bạn nhấn chọn tài khoản GitHub của mình và chọn đúng cái tên `fixflow-due` vừa tạo ở Giai đoạn 1.
   - Nhấn **Finish and Deploy**.
4. **Đợi hoàn tất**: Firebase sẽ mất khoảng 3 phút để cài đặt. Khi xong, bạn sẽ thấy một đường link xanh (ví dụ: `https://fixflow-due.apphosting.app`).

### Giai đoạn 3: Cài đặt vào điện thoại (Biến web thành App)
Khi đã có đường link từ Firebase ở Giai đoạn 2, hãy mở điện thoại lên:

- **Trên iPhone (Dùng Safari)**:
  1. Truy cập vào link web của bạn.
  2. Nhấn nút **Chia sẻ** (biểu tượng ô vuông có mũi tên lên ở dưới cùng màn hình).
  3. Tìm và chọn dòng **"Thêm vào màn hình chính" (Add to Home Screen)**.
- **Trên Android (Dùng Chrome)**:
  1. Truy cập vào link web của bạn.
  2. Nhấn dấu **3 chấm** ở góc trên bên phải.
  3. Chọn **"Cài đặt ứng dụng"** hoặc **"Thêm vào màn hình chính"**.

---

## 🔑 Tài khoản thử nghiệm (Mật khẩu: 123456)
- **Người yêu cầu**: `requester`
- **Lãnh đạo đơn vị**: `leader`
- **Quản lý CSVC**: `manager`
- **Kỹ thuật viên**: `tech`

*© 2026 Hệ thống quản lý sửa chữa v1.0 • Phát triển bởi Phòng Cơ sở vật chất*
