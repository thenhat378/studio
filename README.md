
# 🚀 Requisition Form DUE - Bản Chuẩn Triển Khai v1.0

Dự án Quản lý Phiếu yêu cầu sửa chữa thiết bị được thiết kế riêng cho DUE, tích hợp AI và quy trình 7 bước chuẩn hóa.

---

## 🛠️ CẤU HÌNH QUAN TRỌNG ĐỂ BUILD TRÊN GITHUB

Để GitHub Actions có thể build thành công (không bị lỗi API Key), bạn cần thực hiện:
1. Vào Repository của bạn trên GitHub.
2. Chọn **Settings** -> **Secrets and variables** -> **Actions**.
3. Nhấn **New repository secret**.
4. Name: `FIREBASE_API_KEY`
5. Value: Coppy mã API Key từ tệp `src/firebase/config.ts` (ví dụ: `AIzaSyAXP...`) dán vào.

---

## 📂 HƯỚNG DẪN ĐẨY LÊN GITHUB (GIT UPLOAD)

### 🛑 Sửa lỗi "Need to specify how to reconcile divergent branches"
Nếu bạn gặp lỗi này khi chạy `git pull`, hãy chạy lệnh sau để thiết lập chế độ hợp nhất (merge) mặc định:
```bash
git config pull.rebase false
git pull origin main
```

### Các bước đẩy code lên:
1. **Khởi tạo Git** (nếu chưa làm):
   ```bash
   git init
   ```

2. **Thêm các tệp vào danh sách theo dõi**:
   ```bash
   git add .
   ```

3. **Tạo bản cam kết**:
   ```bash
   git commit -m "Update App Icon and GitHub Actions v1.1"
   ```

4. **Kết nối với Repository của bạn**:
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

Ứng dụng hỗ trợ công nghệ PWA cao cấp với biểu tượng 3 màu D-U-E:
1. Mở link ứng dụng đã deploy bằng trình duyệt điện thoại.
2. **Android (Chrome)**: Chọn 3 chấm -> **"Thêm vào màn hình chính"**.
3. **iPhone (Safari)**: Chọn nút Share -> **"Thêm vào màn hình chính"**.

---
*Phát triển bởi Phòng Cơ sở vật chất - DUE © 2026*
