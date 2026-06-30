import { collection, doc, setDoc, query, where, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export interface Notification {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  type: 'submitted' | 'assigned' | 'resolved' | 'verification';
  read: boolean;
  createdAt: any;
}

// Subscribes to real-time notifications for a user using onSnapshot
export const subscribeToNotifications = (uid: string, callback: (notifications: Notification[]) => void) => {
  const notificationsRef = collection(db, 'notifications');
  const q = query(notificationsRef, where('userId', '==', uid));
  
  return onSnapshot(
    q,
    (snap) => {
      const list: Notification[] = [];
      snap.forEach((doc) => {
        list.push(doc.data() as Notification);
      });
      // Sort in-memory desc by timestamp
      list.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });
      callback(list);
    },
    (error) => {
      console.error('Notification snapshot listener failed:', error);
    }
  );
};

// Creates a new notification document in Firestore
export const sendNotification = async (notificationData: Omit<Notification, 'notificationId' | 'createdAt' | 'read'>): Promise<string> => {
  const notificationsRef = collection(db, 'notifications');
  const newNotifRef = doc(notificationsRef);
  
  const newNotif: Notification = {
    ...notificationData,
    notificationId: newNotifRef.id,
    read: false,
    createdAt: serverTimestamp(),
  };

  await setDoc(newNotifRef, newNotif);
  return newNotifRef.id;
};

// Marks all notifications as read
export const markNotificationsAsRead = async (notifications: Notification[]): Promise<void> => {
  try {
    for (const notif of notifications) {
      if (!notif.read) {
        const docRef = doc(db, 'notifications', notif.notificationId);
        await updateDoc(docRef, { read: true });
      }
    }
  } catch (err) {
    console.error('Failed to mark notifications as read:', err);
  }
};
