# 🚀 REQUISITION FORM DUE - HỆ THỐNG QUẢN LÝ SỬA CHỮA v1.2

Dự án tích hợp AI và quy trình 7 bước chuẩn hóa dành cho DUE. Hệ thống được tối ưu hóa cho di động, hỗ trợ PWA và thông báo đẩy.

---

## 📖 TÀI LIỆU QUAN TRỌNG
*   **[Báo cáo Tổng kết Hệ thống (Board Report)](docs/system-report.md)**: Dành cho trình hội đồng và thuyết minh dự án.
*   **[Hướng dẫn Sử dụng chi tiết](docs/user-guide.md)**: Dành cho các vai trò trong hệ thống.

---

## 🛠️ HƯỚNG DẪN FIX LỖI GIT & TRIỂN KHAI

### 1. Khắc phục lỗi Git (Không cập nhật được code)
Nếu gặp lỗi **"Need to specify how to reconcile divergent branches"**, hãy chạy các lệnh sau:
```bash
git config pull.rebase false
git pull origin main
git add .
git commit -m "Cập nhật tính năng"
git push origin main
```

### 2. Triển khai sang tài khoản khác (Firebase/GitHub)
*   **Bước 1:** Tạo dự án mới trên Firebase Console.
*   **Bước 2:** Cập nhật thông tin trong tệp `src/firebase/config.ts` với thông số mới của bạn.
*   **Bước 3:** Trên GitHub của tài khoản mới, vào **Settings** -> **Secrets** -> **Actions** và tạo một Secret tên là `FIREBASE_API_KEY` với giá trị là API Key của bạn.
*   **Bước 4:** Kết nối Repository với **Firebase App Hosting** hoặc **Vercel** để tự động triển khai.

---

## 📱 TÍNH NĂNG NỔI BẬT
- **D-U-E Branding**: Biểu tượng 3 màu (Cam-Xanh lá-Xanh dương) chuẩn nhận diện thương hiệu.
- **Smart Quantity**: Cho phép tự nhập số lượng linh kiện/thiết bị linh hoạt ngay sau phần mô tả.
- **Auto Image Compression**: Tự động nén ảnh (70%) giúp tải nhanh và tiết kiệm dung lượng.
- **AI Analytics**: Sử dụng Gemini 2.5 Flash để gợi ý nguyên nhân hư hỏng.
- **Admin Tools**: Công cụ "Dọn dẹp hệ thống" chuyên nghiệp để bàn giao dự án sạch.

---
*Phát triển bởi Phòng Cơ sở vật chất - DUE © 2026*