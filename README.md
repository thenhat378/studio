# 🚀 Requisition Form DUE - Bản Chuẩn Triển Khai v1.0

Dự án Quản lý Phiếu yêu cầu sửa chữa thiết bị được thiết kế riêng cho DUE, tích hợp AI và quy trình 7 bước chuẩn hóa.

---

## 📂 HƯỚNG DẪN ĐẨY LÊN GITHUB (GIT UPLOAD)

Để lưu trữ mã nguồn lên GitHub cá nhân, bạn hãy thực hiện các bước sau trong Terminal tại thư mục dự án:

1. **Khởi tạo Git**:
   ```bash
   git init
   ```

2. **Thêm các tệp vào danh sách theo dõi**:
   ```bash
   git add .
   ```

3. **Tạo bản cam kết đầu tiên**:
   ```bash
   git commit -m "Initial commit: Requisition Form DUE v1.0 - Full Production Ready"
   ```

4. **Kết nối với Repository của bạn**:
   *(Tạo 1 repo mới trên GitHub và thay link dưới bằng link của bạn)*
   ```bash
   git remote add origin https://github.com/user/your-repo-name.git
   ```

5. **Đẩy code lên**:
   ```bash
   git branch -M main
   git push -u origin main
   ```

---

## 💻 CÁCH CHẠY LOCAL (TRÊN MÁY TÍNH CÁ NHÂN)

Sau khi tải code về, hãy thực hiện các lệnh sau:

1. **Cài đặt thư viện**:
   ```bash
   npm install
   ```

2. **Chạy chế độ phát triển**:
   ```bash
   npm run dev
   ```
   *Ứng dụng sẽ chạy tại địa chỉ: http://localhost:3000*

---

## 📱 CÁCH CÀI ĐẶT LÊN ĐIỆN THOẠI (PWA)

Ứng dụng hỗ trợ công nghệ PWA cao cấp, giúp cài đặt không cần qua App Store:
1. Mở link ứng dụng đã deploy bằng trình duyệt điện thoại.
2. **Android (Chrome)**: Chọn 3 chấm -> **"Thêm vào màn hình chính"**.
3. **iPhone (Safari)**: Chọn nút Share -> **"Thêm vào màn hình chính"**.
4. Biểu tượng DUE sẽ xuất hiện trên màn hình nền, chạy toàn màn hình cực kỳ mượt mà.

---

## ⚠️ LƯU Ý TRƯỚC KHI BÀN GIAO

- **Làm sạch dữ liệu**: Đăng nhập quyền **Admin**, vào mục **Quản lý người dùng** và nhấn **"Dọn dẹp hệ thống"** để xóa toàn bộ phiếu thử nghiệm và tài khoản rác.
- **Firebase**: Đảm bảo cấu hình trong `src/firebase/config.ts` đã chính xác với dự án Firebase của bạn.

---
*Phát triển bởi Phòng Cơ sở vật chất - DUE © 2026*
