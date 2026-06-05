
# 🚀 Hướng Dẫn Triển Khai & Sử Dụng Hệ Thống

Dự án này là hệ thống Quản lý sửa chữa thiết bị được tối ưu cho thiết bị di động (PWA) và tích hợp AI.

---

## 📖 Hướng dẫn nhanh

### 1. Quy trình sử dụng
Để hiểu rõ cách vận hành giữa 4 vai trò (Người yêu cầu, Lãnh đạo, Quản lý, Kỹ thuật), vui lòng xem:
👉 **[Tài liệu hướng dẫn quy trình chi tiết tại đây](./docs/user-guide.md)**

### 2. Cách Build & Deploy lên điện thoại
Nếu bạn muốn thấy ứng dụng chạy trên điện thoại ngay lập tức:

#### ⚡️ Cách: Dùng Vercel (Nhanh nhất - Chỉ 2 phút)
1. Tải code về máy và up lên một Repo GitHub cá nhân của bạn.
2. Vào [Vercel.com](https://vercel.com/) và đăng nhập bằng GitHub.
3. Nhấn **"Add New"** -> **"Project"** -> Chọn Repo của bạn.
4. Nhấn **"Deploy"**.
5. Gửi link `.vercel.app` vào điện thoại, mở bằng Safari/Chrome và chọn **"Thêm vào màn hình chính"**.

---

## 🔄 Cách cập nhật mã nguồn (Sync Git)

**Quan trọng:** Khi tôi (AI) thay đổi code ở đây, code trên GitHub của bạn sẽ chưa có ngay. Bạn cần thực hiện các bước sau để cập nhật:

1.  **Tải mã nguồn mới nhất:** Nhấn nút **Download Project** (hoặc Export) trong môi trường này để tải về bản mới nhất.
2.  **Ghi đè vào thư mục trên máy:** Giải nén và chép đè vào thư mục dự án trên máy tính của bạn.
3.  **Đẩy lên GitHub:** Mở Terminal tại thư mục đó và gõ:
    ```bash
    git add .
    git commit -m "Cập nhật giao diện di động và tính năng mới"
    git push origin main
    ```
4.  **Kết quả:** Vercel hoặc Firebase App Hosting sẽ tự động nhận diện và cập nhật ứng dụng trên điện thoại của bạn sau 1-2 phút.

---

## 📱 Cài đặt vào điện thoại
*   **iPhone (Safari):** Bấm nút **Chia sẻ** -> **Thêm vào màn hình chính**.
*   **Android (Chrome):** Bấm **3 chấm** -> **Cài đặt ứng dụng**.

## 🔑 Tài khoản Test (Mật khẩu: bất kỳ)
- `requester` (Nhân viên - Tạo yêu cầu)
- `leader` (Lãnh đạo đơn vị - Phê duyệt & Nghiệm thu)
- `manager` (Quản lý CSVC - Phân công kỹ thuật)
- `tech` (Kỹ thuật viên - Thực hiện sửa chữa)

---
*© 2026 Hệ thống quản lý sửa chữa DUE*
