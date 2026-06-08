
# 🚀 Requisition Form DUE - Hệ Thống Quản Lý Sửa Chữa v1.2

Dự án tích hợp AI và quy trình 7 bước chuẩn hóa dành cho DUE.

---

## 🌍 LỰA CHỌN TRIỂN KHAI (DEPLOYMENT)

Để có hiệu năng tốt nhất và sự đồng bộ tuyệt đối với Firebase, hệ thống được tối ưu hóa cho **Firebase App Hosting**:

1.  **Firebase App Hosting (Khuyên dùng)**: 
    - Truy cập [Firebase Console](https://console.firebase.google.com/).
    - Chọn **App Hosting** ở menu bên trái.
    - Kết nối với Repository GitHub của bạn.
    - Firebase sẽ tự động nhận diện cấu hình trong `apphosting.yaml` và triển khai mỗi khi bạn push code.

2.  **Cách thiết lập GitHub Secrets (Bắt buộc để build thành công)**:
    - Vào Repo của bạn trên GitHub -> **Settings** -> **Secrets and variables** -> **Actions**.
    - Tạo `New repository secret` tên là `FIREBASE_API_KEY`.
    - Dán giá trị API Key từ tệp `src/firebase/config.ts` vào.

---

## 🛠️ HƯỚNG DẪN FIX LỖI GIT THƯỜNG GẶP

### 1. Sửa lỗi "Need to specify how to reconcile divergent branches"
Nếu bạn gặp lỗi này khi `git pull`, hãy chạy lệnh sau để thiết lập chế độ hợp nhất (merge) làm mặc định:
```bash
git config pull.rebase false
git pull origin main
```

### 2. Các bước đẩy code an toàn:
```bash
git add .
git commit -m "Cập nhật tính năng Số lượng tự nhập và Fix Deployment"
git push origin main
```

---

## 📱 TÍNH NĂNG MỚI CẬP NHẬT
- **Quản lý số lượng tự nhập**: Nhân viên và Kỹ thuật viên có thể tự do nhập số lượng chính xác ngay sau phần mô tả chi tiết.
- **App Icon 3 màu**: Hiển thị chuẩn D-U-E (Cam-Xanh lá-Xanh dương) trên nền trắng khi cài lên điện thoại.
- **Tự động nén ảnh**: Hình ảnh chụp từ máy ảnh được nén giảm dung lượng (70%) trước khi gửi để đảm bảo tốc độ mượt mà.
- **Push Notifications**: Thông báo đẩy chuyên nghiệp như ứng dụng di động.

---
*Phát triển bởi Phòng Cơ sở vật chất - DUE © 2026*
