
import type {Metadata, Viewport} from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/app-shell';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: 'Ứng dụng Quản lý sửa chữa',
  description: 'Hệ thống hỗ trợ quản lý quy trình sửa chữa thiết bị cơ sở vật chất DUE',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'QLSC DUE',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#0054A4',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="https://picsum.photos/seed/due-university-logo/180/180" />
      </head>
      <body className="font-body antialiased">
        <AppProvider>
          <AppShell>
            {children}
          </AppShell>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
