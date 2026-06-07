# 🚀 Requisition Form DUE - Bản Chuẩn Triển Khai v1.1

Dự án Quản lý Phiếu yêu cầu sửa chữa thiết bị được thiết kế riêng cho DUE, tích hợp AI và quy trình 7 bước chuẩn hóa.

---

## 🛠️ CẤU HÌNH QUAN TRỌNG ĐỂ BUILD TRÊN GITHUB

Để GitHub Actions có thể build thành công (không bị lỗi API Key hay Node 22), bạn cần:
1. Vào Repository của bạn trên GitHub.
2. Chọn **Settings** -> **Secrets and variables** -> **Actions**.
3. Nhấn **New repository secret**.
4. Name: `FIREBASE_API_KEY`
5. Value: Coppy mã API Key từ tệp `src/firebase/config.ts` (ví dụ: `AIzaSyAXP...`) dán vào.

---

## 📂 HƯỚNG DẪN ĐẨY CODE VÀ FIX LỖI GIT (DIVERGENT BRANCHES)

### 🛑 Sửa lỗi "Need to specify how to reconcile divergent branches"
Nếu bạn gặp lỗi này khi chạy `git pull`, hãy chạy lệnh sau để thiết lập chế độ hợp nhất (merge) làm mặc định:
```bash
git config pull.rebase false
git pull origin main
```

### Các bước đẩy code lên GitHub:
1. **Thêm các tệp vào danh sách theo dõi**:
   ```bash
   git add .
   ```
2. **Tạo bản cam kết**:
   ```bash
   git commit -m "Cập nhật App Icon 3 màu và cấu hình Deployment v1.1"
   ```
3. **Đẩy code lên**:
   ```bash
   git push origin main
   ```

---

## 💻 CÁCH CHẠY LOCAL (TRÊN MÁY TÍNH CÁ NHÂN)
1. **Cài đặt thư viện**: `npm install`
2. **Chạy chế độ phát triển**: `npm run dev`
   *Ứng dụng chạy tại: http://localhost:3000*

---

## 📱 CÀI ĐẶT LÊN ĐIỆN THOẠI (ICON 3 MÀU)
Ứng dụng hỗ trợ PWA với biểu tượng D-U-E 3 màu (Cam-Xanh lá-Xanh dương):
1. Mở link ứng dụng trên trình duyệt điện thoại.
2. Chọn **"Thêm vào màn hình chính"** (Add to Home Screen).
3. Biểu tượng 3 màu chuyên nghiệp sẽ xuất hiện trên màn hình của bạn.

---
*Phát triển bởi Phòng Cơ sở vật chất - DUE © 2026*
