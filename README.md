# 🚀 Requisition Form DUE - Bản Chuẩn Triển Khai

Dự án đã được tối ưu hóa cho quy trình 7 bước sửa chữa thiết bị tại DUE. Mã nguồn này đã sẵn sàng để đẩy lên GitHub hoặc triển khai trực tiếp.

---

## 📂 HƯỚNG DẪN ĐẨY LÊN GITHUB (GIT UPLOAD)

Để lưu trữ mã nguồn lên GitHub cá nhân, bạn hãy mở terminal và chạy các lệnh sau:

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
   git commit -m "Initial commit: Requisition Form DUE v1.0"
   ```

4. **Kết nối với Repository của bạn**:
   *(Thay link dưới bằng link Repo bạn vừa tạo trên GitHub)*
   ```bash
   git remote add origin https://github.com/user/your-repo-name.git
   ```

5. **Đẩy code lên**:
   ```bash
   git branch -M main
   git push -u origin main
   ```

---

## 📱 CÁCH CHẠY THỬ TRÊN ĐIỆN THOẠI (PWA)

Ứng dụng hỗ trợ công nghệ PWA, cho phép cài đặt mà không cần qua App Store:
1. Mở link ứng dụng trên trình duyệt điện thoại.
2. **Android**: Chọn 3 chấm -> **Thêm vào màn hình chính**.
3. **iPhone**: Chọn nút Share -> **Thêm vào màn hình chính**.
4. Biểu tượng DUE sẽ xuất hiện trên màn hình nền, chạy toàn màn hình mượt mà.

---

## 🛠 LƯU Ý KHI TRIỂN KHAI (DEPLOY)

- **Firebase Config**: Đảm bảo tệp `src/firebase/config.ts` đã chứa đúng thông số dự án của bạn.
- **Dữ liệu**: Hãy sử dụng tính năng **"Dọn dẹp hệ thống"** trong mục Quản lý người dùng (quyền Admin) để xóa toàn bộ dữ liệu thử nghiệm trước khi bàn giao.
- **Build**: Chạy `npm run build` để kiểm tra lỗi trước khi deploy lên App Hosting.

---
*Phát triển bởi Phòng Cơ sở vật chất - DUE © 2026*
