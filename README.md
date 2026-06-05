
# 🚀 Hướng Dẫn Bảo Trì & Tiếp Tục Dự Án

Dự án **Requisition Form DUE** của bạn đã được lưu trữ an toàn. Để không mất công làm lại, hãy thực hiện theo hướng dẫn này.

---

## 💾 Cách lưu trữ công việc để tắt máy

### 1. Tải về máy tính (Backup)
Mỗi khi kết thúc một buổi làm việc với AI, hãy nhấn nút **"Download Project"** ở góc trên màn hình. 
- Việc này sẽ tải về một tệp `.zip` chứa toàn bộ mã nguồn hiện tại.
- Ngày mai, nếu bạn muốn tiếp tục trong một môi trường mới, bạn chỉ cần mở lại thư mục này.

### 2. Đẩy lên GitHub (Lưu trữ đám mây)
Đây là cách an toàn nhất. Nếu bạn đã có Repo trên GitHub:
```bash
git add .
git commit -m "Cập nhật tính năng ngày hôm nay"
git push origin main
```

### 3. Triển khai lên Vercel/Firebase
Nếu bạn đã Deploy, ứng dụng sẽ luôn trực tuyến tại địa chỉ `.vercel.app` hoặc `.web.app`. Bạn có thể dùng điện thoại truy cập bất cứ lúc nào mà không cần mở máy tính.

---

## 📘 Quy trình 7 bước đã thiết lập
Hệ thống đã được lập trình cứng theo luồng:
1. **Nhân viên**: Tạo phiếu (Trạng thái: `Chờ phê duyệt`).
2. **Lãnh đạo đơn vị**: Duyệt phiếu (Trạng thái: `Đã duyệt`).
3. **Quản lý CSVC**: Phân công kỹ thuật (Trạng thái: `Đã giao việc`).
4. **Kỹ thuật viên**: Báo cáo xong (Trạng thái: `Kỹ thuật xong`).
5. **Quản lý CSVC**: Duyệt hoàn thành kỹ thuật (Trạng thái: `Chờ nghiệm thu`).
6. **Nhân viên**: Xác nhận hài lòng.
7. **Lãnh đạo đơn vị**: Đánh giá & Đóng phiếu (Trạng thái: `Đã hoàn thành`).
*Sau bước 7, Kỹ thuật viên có thể vào in phiếu lưu trữ.*

---

## 🔑 Lưu ý cho ngày mai
- **Dữ liệu**: Nếu bạn đã thực hiện **Reset hệ thống**, bạn cần đăng ký lại tài khoản Admin trước để nhập danh mục thiết bị.
- **Tiếp tục chat**: Khi bạn mở lại cửa sổ chat này, lịch sử của chúng ta vẫn còn đó. Bạn chỉ cần nói "Tiếp tục công việc hôm qua" là tôi sẽ nắm bắt được ngay.

---
*Chúc bạn có một buổi tối nghỉ ngơi tốt! Hẹn gặp lại vào ngày mai.*
