
# 🚀 Hướng Dẫn Triển Khai & Sử Dụng Hệ Thống

Dự án này là hệ thống Quản lý sửa chữa thiết bị được tối ưu cho thiết bị di động (PWA) và tích hợp AI.

---

## 📖 Hướng dẫn nhanh

### 1. Quy trình sử dụng
Để hiểu rõ cách vận hành giữa 4 vai trò (Người yêu cầu, Lãnh đạo, Quản lý, Kỹ thuật), vui lòng xem:
👉 **[Tài liệu hướng dẫn quy trình chi tiết tại đây](./docs/user-guide.md)**

### 2. Cách Build & Deploy lên điện thoại (Dùng Vercel - Nhanh nhất)
1. Tải toàn bộ mã nguồn này về máy tính của bạn (Nút **Download Project**).
2. Up toàn bộ code lên một Repo GitHub cá nhân của bạn.
3. Truy cập [Vercel.com](https://vercel.com/) và đăng nhập bằng GitHub.
4. Nhấn **"Add New"** -> **"Project"** -> Chọn Repo bạn vừa tạo.
5. Nhấn **"Deploy"**.
6. Sau khi hoàn tất, gửi link `.vercel.app` vào điện thoại, mở bằng Safari (iPhone) hoặc Chrome (Android) và chọn **"Thêm vào màn hình chính"**.

---

## 🔄 Cách cập nhật khi có thay đổi (Sync Git)

**Lưu ý:** Vì môi trường này (AI Studio) không tự động đẩy code lên GitHub của bạn, mỗi khi tôi cập nhật tính năng mới, bạn cần làm các bước sau:

1.  **Tải mã nguồn mới nhất:** Nhấn nút **Download Project** trong Studio này để tải bản code đã được tôi cập nhật.
2.  **Ghi đè vào thư mục trên máy:** Giải nén và chép đè tất cả tệp tin vào thư mục dự án hiện tại trên máy tính của bạn.
3.  **Đẩy lên GitHub:** Mở Terminal (hoặc Command Prompt) tại thư mục đó và chạy 3 lệnh sau:
    ```bash
    git add .
    git commit -m "Cập nhật tính năng và giao diện mới từ AI"
    git push origin main
    ```
4.  **Kết quả:** Vercel hoặc Firebase sẽ tự động nhận diện thay đổi và cập nhật ứng dụng trên điện thoại của bạn sau khoảng 1-2 phút.

---

## 📱 Cài đặt vào điện thoại (PWA)
*   **iPhone (Safari):** Bấm nút **Chia sẻ** (hình ô vuông có mũi tên lên) -> Cuộn xuống chọn **Thêm vào màn hình chính** (Add to Home Screen).
*   **Android (Chrome):** Bấm biểu tượng **3 chấm** ở góc trên -> Chọn **Cài đặt ứng dụng** (Install App).

## 🔑 Tài khoản Test (Mật khẩu: bất kỳ)
- `requester` (Nhân viên - Tạo yêu cầu)
- `leader` (Lãnh đạo đơn vị - Phê duyệt & Nghiệm thu)
- `manager` (Quản lý CSVC - Phân công kỹ thuật)
- `tech` (Kỹ thuật viên - Thực hiện sửa chữa)

---
*© 2026 Hệ thống quản lý sửa chữa DUE*
