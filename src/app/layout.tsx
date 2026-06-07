import type {Metadata, Viewport} from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/app-shell';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/lib/store';
import { FirebaseProvider } from '@/firebase/provider';

// Biểu tượng SVG DUE chuẩn: D (Cam #F58220), U (Xanh lá #009E49), E (Xanh dương #0054A4) trên nền trắng
const appIconSvg = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkZGRkZGIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJJbnRlciwgc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjkwMCIgZm9udC1zaXplPSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj48dHNwYW4gZmlsbD0iI0Y1ODIyMCI+RDwvdHNwYW4+PHRzcGFuIGZpbGw9IiMwMDlFNDkiPlU8L3RzcGFuPjx0c3BhbiBmaWxsPSIjMDA1NEE0Ij5FPC90c3Bhbj48L3RleHQ+PC9zdmc+`;

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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href={appIconSvg} />
        <link rel="icon" href={appIconSvg} />
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
