# 📘 Hướng Dẫn Quy Trình Sử Dụng Hệ Thống Quản Lý Sửa Chữa

Tài liệu này hướng dẫn chi tiết quy trình 7 bước từ khi phát hiện sự cố đến khi đóng phiếu và lưu trữ hồ sơ.

---

## 👥 Các vai trò trong hệ thống
1.  **Người yêu cầu (Requester):** Nhân viên/Giảng viên phát hiện hỏng hóc.
2.  **Lãnh đạo đơn vị (Unit Leader):** Người duyệt yêu cầu tại bộ phận và nghiệm thu cuối cùng.
3.  **Quản lý CSVC (CSVC Manager):** Người điều phối kỹ thuật viên và kiểm tra chất lượng.
4.  **Kỹ thuật viên (Technician):** Người trực tiếp sửa chữa.

---

## 🔄 Quy trình 7 bước chuẩn

### Bước 1: Tạo yêu cầu (Người yêu cầu)
- Truy cập vào **Tạo yêu cầu mới**.
- Nhập mô tả sự cố (Ví dụ: "Máy chiếu phòng 302 không lên hình").
- Sử dụng nút **"Phân tích bằng AI"** để nhận gợi ý nguyên nhân và phân loại tự động.
- Chọn thiết bị từ danh mục và nhấn **Gửi**.

### Bước 2: Phê duyệt tại đơn vị (Lãnh đạo đơn vị)
- Lãnh đạo vào mục **Xét duyệt & Nghiệm thu**.
- Kiểm tra thông tin phiếu đang ở trạng thái "Chờ phê duyệt".
- Nhấn **Duyệt** để chuyển phiếu lên Phòng Cơ sở vật chất.

### Bước 3: Phân công kỹ thuật (Quản lý CSVC)
- Quản lý vào mục **Điều phối & Quản lý**.
- Tại tab "Chờ phân công", chọn một **Kỹ thuật viên** phù hợp từ danh sách.
- Nhấn **Giao việc**.

### Bước 4: Thực hiện sửa chữa (Kỹ thuật viên)
- Kỹ thuật viên vào mục **Nhiệm vụ của tôi**.
- Nhấn **Bắt đầu làm** để ghi nhận thời gian bắt đầu.
- Sau khi sửa xong, nhấn **Báo cáo hoàn thành**.
- Chọn hình thức xử lý (Thay mới/Sửa chữa) và nhập chi tiết nội dung đã làm.

### Bước 5: Duyệt hoàn thành kỹ thuật (Quản lý CSVC)
- Quản lý vào lại mục **Điều phối & Quản lý**, tab "Duyệt hoàn thành".
- Kiểm tra báo cáo của kỹ thuật viên.
- Nhấn **Duyệt hoàn thành kỹ thuật** để chuyển phiếu về cho đơn vị sử dụng nghiệm thu.

### Bước 6: Xác nhận hài lòng (Người yêu cầu)
- Người yêu cầu nhận được thông báo, vào chi tiết phiếu.
- Nhấn **Xác nhận hài lòng** (Thumbs Up) để phản hồi về kết quả sửa chữa.

### Bước 7: Nghiệm thu & Đóng phiếu (Lãnh đạo đơn vị)
- Lãnh đạo đơn vị vào mục **Xét duyệt & Nghiệm thu**, tab "Chờ nghiệm thu".
- Chọn mức độ đánh giá (1-5 sao).
- Nhấn **Xác nhận & Đóng phiếu**. Trạng thái phiếu chuyển thành "Đã đóng".

---

## 📑 In phiếu báo cáo lưu trữ
Sau khi phiếu đã **Đóng**, bất kỳ ai liên quan cũng có thể vào chi tiết phiếu và nhấn **"In phiếu lưu trữ"**.
- Hệ thống tự động chuyển đổi giao diện sang mẫu văn bản hành chính chuẩn.
- Bao gồm đầy đủ thông tin: Người yêu cầu, Kỹ thuật viên, Nội dung sửa chữa, Đánh giá và các ô ký tên.

---
*Lưu ý: Để thử nghiệm nhanh các vai trò, hãy sử dụng tài khoản test: `requester`, `leader`, `manager`, `tech`.*