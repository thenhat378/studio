
'use client';

import { useEffect } from 'react';
import { useFirebase } from '@/firebase';
import { getToken, onMessage, isSupported } from 'firebase/messaging';
import { useAppStore } from '@/lib/store';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export function MessagingSetup() {
  const { messaging, db } = useFirebase();
  const { currentUser } = useAppStore();
  const { toast } = useToast();

  useEffect(() => {
    if (!messaging || !currentUser || !db) return;

    const requestPermission = async () => {
      try {
        const supported = await isSupported();
        if (!supported) return;

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const token = await getToken(messaging, {
            vapidKey: 'BPHl-qS5M_QhT2_mP-z8Z-X-X_X_X_X_X_X_X_X_X_X_X_X' // Thay thế bằng VAPID key thật từ Firebase Console nếu cần
          });
          
          if (token) {
            // Lưu token vào Firestore để gửi thông báo sau này
            await updateDoc(doc(db, 'users', currentUser.id), {
              fcmToken: token
            });
          }
        }
      } catch (error) {
        console.error('Error setting up messaging:', error);
      }
    };

    requestPermission();

    // Lắng nghe tin nhắn khi ứng dụng đang mở (foreground)
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received in foreground: ', payload);
      toast({
        title: payload.notification?.title || 'Thông báo mới',
        description: payload.notification?.body || 'Bạn có một tin nhắn mới từ hệ thống.',
      });

      // Hiển thị thông báo hệ thống nếu được phép
      if (Notification.permission === 'granted') {
        new Notification(payload.notification?.title || 'Thông báo mới', {
          body: payload.notification?.body,
          icon: '/favicon.ico'
        });
      }
    });

    return () => unsubscribe();
  }, [messaging, currentUser, db, toast]);

  return null;
}
