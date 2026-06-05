'use client';

/**
 * QUAN TRỌNG: Lỗi "API Key not valid" xảy ra do bạn chưa điền thông số Firebase thực tế.
 * 
 * HƯỚNG DẪN:
 * 1. Truy cập https://console.firebase.google.com/
 * 2. Chọn dự án của bạn -> Nhấn vào biểu tượng bánh răng (Project Settings).
 * 3. Cuộn xuống phần "Your apps" -> Chọn ứng dụng Web (biểu tượng </>).
 * 4. Sao chép đối tượng `firebaseConfig` và dán các giá trị vào bên dưới.
 * 5. Đừng quên vào mục "Authentication" -> "Sign-in method" và BẬT "Email/Password".
 */

export const firebaseConfig = {
  apiKey: "AIzaSy_Placeholder_Please_Replace_With_Real_Key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.firebasestorage.app",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef..."
};
