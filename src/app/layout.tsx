import type {Metadata, Viewport} from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/app-shell';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/lib/store';
import { FirebaseProvider } from '@/firebase/provider';
import { MessagingSetup } from '@/components/messaging-setup';

// Biểu tượng SVG DUE chuẩn: D (Cam #F58220), U (Xanh lá #009E49), E (Xanh dương #0054A4) trên nền trắng
// Tối ưu hóa font-size và letter-spacing để chữ vừa vặn, đậm đà trong khung icon di động
const appIconSvg = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIGZpbGw9IiNGRkZGRkYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSI5MDAiIGZvbnQtc2l6ZT0iMjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgbGV0dGVyLXNwYWNpbmc9Ii0xMCI+PHRzcGFuIGZpbGw9IiNGNTgyMjAiPkQ8L3RzcGFuPjx0c3BhbiBmaWxsPSIjMDA5RTQ5Ij5VPC90c3Bhbj48dHNwYW4gZmlsbD0iIzAwNTRBNCI+RTwvdHNwYW4+PC90ZXh0Pjwvc3ZnPg==`;

export const metadata: Metadata = {
  title: 'Requisition form DUE',
  description: 'Hệ thống hỗ trợ quản lý quy trình sửa chữa thiết bị cơ sở vật chất DUE',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
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
  viewportFit: 'cover',
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
            <MessagingSetup />
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
