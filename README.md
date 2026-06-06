
# 🚀 Hướng Dẫn Bảo Trì & Tiếp Tục Dự Án (Lưu Trữ An Toàn)

Dự án **Requisition Form DUE** của bạn đã được cập nhật bản chuẩn nhất. Để không mất công làm lại khi bạn tắt máy, hãy thực hiện theo hướng dẫn này.

---

## 💾 Cách lưu trữ công việc để tắt máy

### 1. Tải về máy tính (Khuyên dùng)
Hãy nhấn nút **"Download Project"** (Biểu tượng mũi tên đi xuống hoặc biểu tượng nén tập tin) ở thanh công cụ phía trên cùng bên phải màn hình IDE.
- Việc này sẽ tải về tệp `.zip` chứa toàn bộ mã nguồn hiện tại.
- Ngày mai, bạn chỉ cần mở lại Studio và "Import" thư mục này hoặc mở trực tiếp để tiếp tục.

### 2. Sử dụng GitHub (Dành cho lập trình viên)
Nếu bạn có tài khoản GitHub, hãy đẩy mã nguồn lên Repo cá nhân thông qua thanh công cụ Git trong IDE.

---

## 📱 Cách chạy ứng dụng trên Điện thoại (Android/iOS)

### Cách 1: Cài đặt dạng PWA (Khuyên dùng - Không cần máy tính)
1. Mở trình duyệt (Chrome/Safari) trên điện thoại và truy cập đường link ứng dụng đang chạy.
2. Chọn menu trình duyệt (3 chấm trên Chrome hoặc nút Share trên Safari).
3. Chọn **"Thêm vào màn hình chính" (Add to Home Screen)**.
4. Ứng dụng sẽ có biểu tượng DUE trên màn hình và chạy mượt mà như App thật.

### Cách 2: Tạo file .apk (Cần máy tính)
Nếu bạn muốn có file `.apk` để gửi cho người khác cài đặt:
1. Tải mã nguồn về máy tính.
2. Cài đặt **Node.js** và **Android Studio**.
3. Mở Terminal tại thư mục dự án và chạy các lệnh:
   ```bash
   npm install
   npm run build
   npx cap init "Requisition DUE" com.due.requisition
   npx cap add android
   npx cap copy
   npx cap open android
   ```
4. Trong Android Studio, chọn **Build > Build APK** để nhận file `.apk` cuối cùng.

---

## 📘 Quy trình kiểm thử UAT (Bắt đầu từ đầu)
Hệ thống đã được làm sạch dữ liệu. Bạn hãy thực hiện theo trình tự sau:

1. **Khởi tạo Admin**: 
   - Vào tab **Đăng ký mới**.
   - Nhập thông tin và chọn vai trò **Quản trị viên (Admin)**.
   - Đăng nhập bằng tài khoản này -> Vào mục **Thiết bị** -> Nhập danh mục thiết bị cho 4 nhóm (Điện tử, Điện, Nước, Khác).
2. **Nhân viên (Người yêu cầu)**: Đăng ký tài khoản -> Tạo phiếu yêu cầu (có đính kèm hình ảnh & dùng AI).
3. **Lãnh đạo đơn vị**: Đăng ký tài khoản (cùng đơn vị với Nhân viên) -> Duyệt phiếu bước 2.
4. **Quản lý CSVC**: Đăng ký tài khoản -> Phân công Kỹ thuật viên.
5. **Kỹ thuật viên**: Đăng ký tài khoản -> Thực hiện & Báo cáo hoàn thành.
6. **Quản lý CSVC**: Duyệt hoàn thành kỹ thuật.
7. **Lãnh đạo đơn vị**: Nghiệm thu & Đóng phiếu.

---

## 🔑 Lưu ý quan trọng
- **Mật khẩu**: Yêu cầu 8 ký tự và ít nhất 1 ký tự đặc biệt (!@#...).
- **Nút Reset**: Trong mục **Người dùng** của Admin, có nút **"Dọn dẹp Phiếu & Người dùng"** để bạn xóa sạch mọi dữ liệu và bắt đầu lại đợt kiểm thử mới bất cứ lúc nào.

---
*Hệ thống đã sẵn sàng. Chúc bạn có một buổi kiểm thử thành công!*
