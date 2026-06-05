
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ứng dụng Quản lý sửa chữa',
    short_name: 'QLSC DUE',
    description: 'Hệ thống hỗ trợ quản lý quy trình sửa chữa thiết bị cơ sở vật chất DUE',
    start_url: '/',
    display: 'standalone',
    background_color: '#F0F2F5',
    theme_color: '#0054A4',
    icons: [
      {
        src: 'https://picsum.photos/seed/due-university-logo/192/192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://picsum.photos/seed/due-university-logo/512/512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
