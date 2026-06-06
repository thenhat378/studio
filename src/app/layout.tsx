
import type {Metadata, Viewport} from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/app-shell';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/lib/store';
import { FirebaseProvider } from '@/firebase/provider';

export const metadata: Metadata = {
  title: 'Requisition form DUE',
  description: 'Hệ thống hỗ trợ quản lý quy trình sửa chữa thiết bị cơ sở vật chất DUE',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Requisition DUE',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#0054A4', // Exact DUE Blue
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="https://placehold.co/180x180/FFFFFF/0054A4?text=DUE+1975" />
      </head>
      <body className="font-body antialiased">
        <FirebaseProvider>
          <AppProvider>
            <AppShell>
              {children}
            </AppShell>
            <Toaster />
          </AppProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
