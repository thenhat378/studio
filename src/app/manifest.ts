import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  // Biểu tượng SVG DUE chuẩn: D (Cam #F58220), U (Xanh lá #009E49), E (Xanh dương #0054A4) trên nền trắng
  const iconSvg = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIGZpbGw9IiNGRkZGRkYiLz48dGV4dCB4PSI1MCUiIHk9IjUyJSIgZm9udC1mYW1pbHk9IidJbnRlcicsIHNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSI5MDAiIGZvbnQtc2l6ZT0iMjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iLTEwIj48dHNwYW4gZmlsbD0iI0Y1ODIyMCI+RDwvdHNwYW4+PHRzcGFuIGZpbGw9IiMwMDlFNDkiPlU8L3RzcGFuPjx0c3BhbiBmaWxsPSIj0DA1NEE0Ij5FPC90c3Bhbj48L3RleHQ+PC9zdmc+`;

  return {
    name: 'Requisition form DUE',
    short_name: 'Requisition DUE',
    description: 'Hệ thống hỗ trợ quản lý quy trình sửa chữa thiết bị cơ sở vật chất DUE',
    start_url: '/',
    display: 'standalone',
    orientation: 'any', // Cho phép tự động xoay khi thay đổi chiều điện thoại
    background_color: '#F4F7FE',
    theme_color: '#0054A4',
    icons: [
      {
        src: iconSvg,
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'maskable'
      },
      {
        src: iconSvg,
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any'
      },
    ],
  }
}
