
# 🚀 Hướng Dẫn Bảo Trì & Tiếp Tục Dự Án (Lưu Trữ An Toàn)

Dự án **Requisition Form DUE** của bạn đã được cập nhật bản chuẩn nhất. Để không mất công làm lại khi bạn tắt máy, hãy thực hiện theo hướng dẫn này.

---

## 💾 Cách lưu trữ công việc để tắt máy

### 1. Tải về máy tính (Khuyên dùng)
Hãy nhấn nút **"Download Project"** hoặc biểu tượng **Export** ở thanh công cụ phía trên cùng bên phải màn hình IDE.
- Việc này sẽ tải về tệp `.zip` chứa toàn bộ mã nguồn hiện tại.
- Ngày mai, bạn chỉ cần mở lại Studio và "Import" thư mục này hoặc mở trực tiếp để tiếp tục.

### 2. Sử dụng GitHub (Dành cho lập trình viên)
Nếu bạn có tài khoản GitHub, hãy đẩy mã nguồn lên Repo cá nhân:
```bash
git add .
git commit -m "UAT Ready - Đã làm sạch dữ liệu và sửa lỗi"
git push origin main
```

### 3. Đã đồng bộ với Firebase
Mọi thay đổi tôi thực hiện thông qua chat đã được tự động lưu vào bộ nhớ dự án của Firebase Studio. Tuy nhiên, tải bản ZIP về máy vẫn là cách an toàn nhất để tránh các lỗi mạng hoặc hết hạn phiên làm việc.

---

## 📘 Quy trình kiểm thử 7 bước (Sạch hoàn toàn)
Hệ thống hiện tại đã được làm sạch để bạn bắt đầu UAT:
1. **Admin**: Đăng ký tài khoản Admin đầu tiên -> Vào mục **Thiết bị** -> Nhập danh mục thiết bị gốc (Máy chiếu, Bàn ghế...).
2. **Nhân viên**: Đăng ký tài khoản -> Tạo phiếu yêu cầu (có đính kèm minh chứng hình ảnh).
3. **Lãnh đạo đơn vị**: Đăng ký tài khoản (cùng đơn vị với Nhân viên) -> Duyệt phiếu bước 2.
4. **Quản lý CSVC**: Đăng ký tài khoản -> Phân công Kỹ thuật viên.
5. **Nhân viên (Kỹ thuật)**: Đăng ký tài khoản -> Thực hiện & Báo cáo hoàn thành.
6. **Quản lý CSVC**: Duyệt hoàn thành kỹ thuật.
7. **Nhân viên/Lãnh đạo**: Xác nhận hài lòng & Đóng phiếu.

---

## 🔑 Lưu ý quan trọng
- **Mật khẩu**: Hệ thống không còn mật khẩu mặc định 123, bạn hãy tự tạo mật khẩu khi đăng ký.
- **Tiếp tục chat**: Khi bạn mở lại cửa sổ chat này vào ngày mai, hãy nói "Tiếp tục công việc hôm qua" để tôi nắm bắt lại ngữ cảnh.

---
*Chúc bạn có một buổi tối nghỉ ngơi tốt! Hẹn gặp lại vào ngày mai để hoàn tất dự án.*
