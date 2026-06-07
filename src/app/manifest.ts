import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  // Biểu tượng SVG DUE chuẩn: D (Cam #F58220), U (Xanh lá #009E49), E (Xanh dương #0054A4) trên nền trắng
  const iconSvg = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkZGRkZGIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJJbnRlciwgc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjkwMCIgZm9udC1zaXplPSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj48dHNwYW4gZmlsbD0iI0Y1ODIyMCI+RDwvdHNwYW4+PHRzcGFuIGZpbGw9IiMwMDlFNDkiPlU8L3RzcGFuPjx0c3BhbiBmaWxsPSIjMDA1NEE0Ij5FPC90c3Bhbj48L3RleHQ+PC9zdmc+`;

  return {
    name: 'Requisition form DUE',
    short_name: 'Requisition DUE',
    description: 'Hệ thống hỗ trợ quản lý quy trình sửa chữa thiết bị cơ sở vật chất DUE',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
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
