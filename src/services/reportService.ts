import { collection, doc, setDoc, getDocs, query, where, serverTimestamp, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export interface Report {
  reportId: string;
  reportedBy: string;
  userId: string; // compatibility key matching reportedBy
  title: string;
  description: string;
  category: string;
  status: 'Pending' | 'pending' | 'assigned' | 'in-progress' | 'resolved' | 'Resolved';
  priority: 'pending' | 'low' | 'medium' | 'high' | 'critical';
  createdAt: any;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  // Flat location fields
  latitude: number;
  longitude: number;
  address: string;
  imageUrl: string;
  // Gemini AI details
  aiSummary: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'pending';
  department: string;
  verificationCount: number;
}

// Saves a new report to Firestore
export const submitReport = async (reportData: Omit<Report, 'reportId' | 'createdAt' | 'status' | 'verificationCount'>): Promise<string> => {
  const reportsRef = collection(db, 'reports');
  const newReportRef = doc(reportsRef); // Auto-generates document ID
  
  const newReport: Report = {
    ...reportData,
    reportId: newReportRef.id,
    status: 'Pending',
    verificationCount: 0,
    createdAt: serverTimestamp(),
  };

  await setDoc(newReportRef, newReport);
  return newReportRef.id;
};

// Gets all reports filed by a specific citizen
export const getMyReports = async (uid: string): Promise<Report[]> => {
  const reportsRef = collection(db, 'reports');
  const q = query(reportsRef, where('userId', '==', uid));
  const snap = await getDocs(q);
  
  const reports: Report[] = [];
  snap.forEach((doc) => {
    reports.push(doc.data() as Report);
  });

  // Sort in memory desc
  reports.sort((a, b) => {
    const aTime = a.createdAt?.seconds || 0;
    const bTime = b.createdAt?.seconds || 0;
    return bTime - aTime;
  });

  return reports;
};

// Subscribes to real-time reports submitted by a specific user using onSnapshot
export const subscribeToMyReports = (uid: string, callback: (reports: Report[]) => void) => {
  const reportsRef = collection(db, 'reports');
  const q = query(reportsRef, where('userId', '==', uid));
  
  return onSnapshot(
    q,
    (snap) => {
      const reports: Report[] = [];
      snap.forEach((doc) => {
        reports.push(doc.data() as Report);
      });

      // In-memory sort desc
      reports.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });

      callback(reports);
    },
    (error) => {
      console.error('My Reports snapshot listener failed:', error);
    }
  );
};

// Subscribes to real-time updates from Firestore using onSnapshot
export const subscribeToReports = (callback: (reports: Report[]) => void) => {
  const reportsRef = collection(db, 'reports');
  
  return onSnapshot(
    reportsRef,
    (snap) => {
      const reports: Report[] = [];
      snap.forEach((doc) => {
        reports.push(doc.data() as Report);
      });

      // In-memory sort desc by timestamp
      reports.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });

      callback(reports);
    },
    (error) => {
      console.error('Reports snapshot listener failed:', error);
    }
  );
};

// Updates a report's status or fields dynamically
export const updateReportStatus = async (reportId: string, updates: Partial<Report>): Promise<void> => {
  const docRef = doc(db, 'reports', reportId);
  await updateDoc(docRef, updates);
};
