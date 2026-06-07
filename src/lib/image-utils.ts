/**
 * Tiện ích nén ảnh client-side để giảm dung lượng trước khi tải lên.
 */

export async function compressImage(
  dataUrl: string,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Tính toán tỷ lệ nén dựa trên kích thước tối đa
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl); // Trả về ảnh gốc nếu không tạo được context
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      
      // Xuất ra base64 với chất lượng nén (0.1 - 1.0)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    img.onerror = (e) => reject(e);
  });
}
