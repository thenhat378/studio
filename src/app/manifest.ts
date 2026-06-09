import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  // Biểu tượng SVG DUE chuẩn 3 màu, được tối ưu hóa cho maskable icon trên di động
  const iconSvg = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIGZpbGw9IiNGRkZGRkYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSI5MDAiIGZvbnQtc2l6ZT0iMjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgbGV0dGVyLXNwYWNpbmc9Ii0xMCI+PHRzcGFuIGZpbGw9IiNGNTgyMjAiPkQ8L3RzcGFuPjx0c3BhbiBmaWxsPSIjMDA5RTQ5Ij5VPC90c3Bhbj48dHNwYW4gZmlsbD0iIzAwNTRBNCI+RTwvdHNwYW4+PC90ZXh0Pjwvc3ZnPg==`;

  return {
    name: 'Requisition form DUE',
    short_name: 'Requisition DUE',
    description: 'Hệ thống hỗ trợ quản lý quy trình sửa chữa thiết bị cơ sở vật chất DUE',
    start_url: '/',
    display: 'standalone',
    orientation: 'any',
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
