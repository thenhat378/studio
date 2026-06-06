# 🚀 Hướng Dẫn Bảo Trì & Tiếp Tục Dự Án (Lưu Trữ An Toàn)

Dự án **Requisition Form DUE** của bạn đã được cập nhật bản chuẩn nhất. Để không mất công làm lại khi bạn tắt máy, hãy thực hiện theo hướng dẫn này.

---

## 📱 CÁCH CHẠY THỬ TRÊN ĐIỆN THOẠI (Mobile)

### Cách 1: Chạy qua trình duyệt (Nhanh nhất)
1. Hãy copy đường link URL của ứng dụng ở thanh địa chỉ phía trên IDE (ví dụ: `https://9002-studio-...`).
2. Gửi đường link này vào điện thoại (qua Zalo, Email...).
3. Mở link trên điện thoại bằng Chrome (Android) hoặc Safari (iPhone).

### Cách 2: Cài đặt dạng PWA (Trải nghiệm như App thật)
1. Sau khi mở link trên điện thoại ở Bước 1.
2. **Android:** Chọn Menu Chrome (3 chấm) -> **Thêm vào màn hình chính**.
3. **iPhone:** Chọn nút Share trên Safari -> **Thêm vào màn hình chính**.
4. Ứng dụng sẽ có biểu tượng DUE trên màn hình và chạy toàn màn hình (không có thanh trình duyệt), cảm ứng mượt mà như App cài từ Store.

---

## 💾 CÁCH LƯU TRỮ CÔNG VIỆC ĐỂ TẮT MÁY

### 1. Tải về máy tính (Khuyên dùng)
Hãy nhấn nút **"Download Project"** ở thanh công cụ phía trên cùng bên phải màn hình IDE.
- Việc này sẽ tải về tệp `.zip` chứa toàn bộ mã nguồn hiện tại.
- Bạn có thể giải nén và mở bằng VS Code để tiếp tục phát triển hoặc triển khai lên hosting riêng.

### 2. Sử dụng GitHub
Nếu bạn có tài khoản GitHub, hãy đẩy mã nguồn lên Repo cá nhân thông qua thanh công cụ Git trong IDE.

---

## 📘 Quy trình kiểm thử UAT (Bắt đầu từ đầu)
Hệ thống đã được làm sạch dữ liệu. Bạn hãy thực hiện theo trình tự sau:

1. **Khởi tạo Admin**: Vào tab **Đăng ký mới** -> Nhập thông tin và chọn vai trò **Quản trị viên (Admin)**. Đăng nhập -> Vào mục **Thiết bị** để nhập danh mục.
2. **Nhân viên**: Đăng ký -> Tạo phiếu yêu cầu (có chụp ảnh & dùng AI).
3. **Lãnh đạo đơn vị**: Đăng ký (cùng đơn vị nhân viên) -> Duyệt phiếu bước 2.
4. **Quản lý CSVC**: Đăng ký -> Phân công Kỹ thuật viên.
5. **Kỹ thuật viên**: Đăng ký -> Thực hiện & Báo cáo hoàn thành.
6. **Quản lý CSVC**: Duyệt hoàn thành kỹ thuật.
7. **Lãnh đạo đơn vị**: Nghiệm thu & Đóng phiếu.

---

## 🔑 Lưu ý quan trọng trước khi Deploy
- **Mật khẩu**: Yêu cầu 8 ký tự và ít nhất 1 ký tự đặc biệt (!@#...).
- **Làm sạch dữ liệu**: Trong mục **Người dùng** của Admin, hãy nhấn nút **"Dọn dẹp Phiếu & Người dùng"** để xóa toàn bộ dữ liệu rác trước khi bàn giao chính thức.
- **Tài khoản mặc định**: Sau khi dọn dẹp, hệ thống sẽ chỉ giữ lại tài khoản của chính bạn (Admin).

---
*Hệ thống đã sẵn sàng cho giai đoạn triển khai chính thức. Chúc bạn có một buổi vận hành thành công!*