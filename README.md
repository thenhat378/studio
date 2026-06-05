
# 🚀 Cách Build & Deploy "Siêu Tốc" Để Thử Trên Điện Thoại

Nếu bạn muốn thấy ứng dụng chạy trên điện thoại ngay lập tức mà không muốn đợi cấu hình Firebase App Hosting phức tạp, hãy thử 2 cách sau:

---

## ⚡️ Cách 1: Dùng Vercel (Nhanh nhất - Chỉ 2 phút)
Đây là cách "mì ăn liền" cho Next.js, cực kỳ mượt mà:
1. Vào [Vercel.com](https://vercel.com/) và đăng nhập bằng tài khoản GitHub của bạn.
2. Nhấn **"Add New"** -> **"Project"**.
3. Chọn cái Kho lưu trữ (Repository) bạn vừa up lên.
4. Nhấn **"Deploy"**.
5. Đợi 1 phút, Vercel sẽ cho bạn một đường link `https://tên-dự-án.vercel.app`.
6. Gửi link này vào điện thoại, mở bằng Safari/Chrome và cài đặt như hướng dẫn.

---

## 🔥 Cách 2: Dùng lệnh Firebase CLI (Nếu đã cài Node.js trên máy)
Cách này giúp bạn đẩy code thẳng từ máy tính lên Firebase Hosting:

1. **Cài công cụ Firebase**: 
   `npm install -g firebase-tools`
2. **Đăng nhập**: 
   `firebase login`
3. **Khởi tạo (Chỉ làm 1 lần)**: 
   `firebase init hosting`
   * Chọn `Use an existing project` (Chọn đúng dự án trên web của bạn).
   * Chọn `Next.js` khi được hỏi về framework.
4. **Deploy**: 
   `npm run build`
   `firebase deploy`

---

## 📱 Cách Cài Vào Điện Thoại (Sau khi có link)
* **iPhone (Safari)**: Bấm nút **Chia sẻ** -> **Thêm vào màn hình chính**.
* **Android (Chrome)**: Bấm **3 chấm** -> **Cài đặt ứng dụng**.

## 🔑 Tài khoản Test (Mật khẩu: 123456)
- `requester`, `leader`, `manager`, `tech`

---
*Lưu ý quan trọng: Nhớ thay các thông số trong `src/firebase/config.ts` để dữ liệu thật có thể lưu trữ được nhé!*
