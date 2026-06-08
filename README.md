
# 🚀 Requisition Form DUE - Hệ Thống Quản Lý Sửa Chữa v1.2

Dự án tích hợp AI và quy trình 7 bước chuẩn hóa dành cho DUE.

---

## 🛠️ HƯỚNG DẪN FIX LỖI GIT (KHÔNG CẬP NHẬT ĐƯỢC)

Nếu bạn gặp lỗi **"Need to specify how to reconcile divergent branches"** khi `git pull`, hãy chạy lệnh sau để thiết lập chế độ hợp nhất (merge) làm mặc định:

1. **Chạy lệnh cấu hình:**
```bash
git config pull.rebase false
```

2. **Tiến hành kéo code mới nhất:**
```bash
git pull origin main
```

3. **Đẩy code của bạn lên (nếu có):**
```bash
git add .
git commit -m "Cập nhật tính năng"
git push origin main
```

---

## 🌍 LỰA CHỌN TRIỂN KHAI (DEPLOYMENT)

Hệ thống được tối ưu hóa cho **Firebase App Hosting**:

1. **Cách thiết lập GitHub Secrets (Bắt buộc để build thành công):**
    - Vào Repo của bạn trên GitHub -> **Settings** -> **Secrets and variables** -> **Actions**.
    - Tạo `New repository secret` tên là `FIREBASE_API_KEY`.
    - Dán giá trị API Key từ tệp `src/firebase/config.ts` vào.

---

## 📱 TÍNH NĂNG MỚI CẬP NHẬT
- **Quản lý số lượng tự nhập**: Nhân viên và Kỹ thuật viên có thể tự do nhập số lượng chính xác ngay sau phần mô tả chi tiết.
- **App Icon 3 màu**: Hiển thị chuẩn D-U-E (Cam-Xanh lá-Xanh dương) trên nền trắng.
- **Tự động nén ảnh**: Hình ảnh chụp từ máy ảnh được nén giảm dung lượng (70%) trước khi gửi.
- **Push Notifications**: Thông báo đẩy chuyên nghiệp như ứng dụng di động.

---
*Phát triển bởi Phòng Cơ sở vật chất - DUE © 2026*
