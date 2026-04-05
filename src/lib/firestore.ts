import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { UserRole } from '@/contexts/AuthContext';

// ── Users ──
export interface FirestoreUser {
  uid: string;
  name: string;
  email: string;
  regNo?: string;
  department: string;
  section?: string;
  phone: string;
  role: UserRole;
  isHOD?: boolean;
  createdAt: Timestamp;
}

export const createUser = async (data: Omit<FirestoreUser, 'createdAt'>) => {
  await setDoc(doc(db, 'users', data.uid), { ...data, createdAt: Timestamp.now() });
};

export const getUser = async (uid: string) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as FirestoreUser) : null;
};

export const getAllUsers = async () => {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map(d => d.data() as FirestoreUser);
};

export const getUsersByRole = async (role: UserRole) => {
  const q = query(collection(db, 'users'), where('role', '==', role));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as FirestoreUser);
};

// ── Attendance ──
export interface AttendanceDoc {
  id?: string;
  date: string;
  department: string;
  section: string;
  period: string;
  records: { regNo: string; name: string; present: boolean }[];
  savedBy: string;
  savedAt: string;
}

export const saveAttendanceRecord = async (record: AttendanceDoc) => {
  const ref = await addDoc(collection(db, 'attendance'), { ...record, savedAt: new Date().toISOString() });
  return ref.id;
};

export const getAttendanceRecords = async (department: string, section: string) => {
  const q = query(
    collection(db, 'attendance'),
    where('department', '==', department),
    where('section', '==', section),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as AttendanceDoc));
};

// ── OD Applications ──
export interface ODDoc {
  id?: string;
  eventName: string;
  date: string;
  time: string;
  venue: string;
  teamMembers: { name: string; regNo: string; department: string }[];
  proofUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  studentEmail: string;
  studentName: string;
  studentUid: string;
}

export const addODApplication = async (od: Omit<ODDoc, 'id' | 'status' | 'submittedAt'>) => {
  const ref = await addDoc(collection(db, 'odApplications'), {
    ...od,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  });
  return ref.id;
};

export const getAllODApplications = async () => {
  const snap = await getDocs(collection(db, 'odApplications'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ODDoc));
};

export const updateODStatus = async (id: string, status: 'approved' | 'rejected') => {
  await updateDoc(doc(db, 'odApplications', id), { status });
};

// ── Achievements ──
export interface AchievementDoc {
  id?: string;
  name: string;
  regNo: string;
  department: string;
  section: string;
  date: string;
  status: 'prize_winner_1' | 'prize_winner_2' | 'prize_winner_3' | 'participant' | 'volunteer';
  certificateUrl?: string;
  photoUrl?: string;
  verified: boolean;
  submittedAt: string;
  studentUid: string;
}

export const addAchievementDoc = async (a: Omit<AchievementDoc, 'id' | 'submittedAt'>) => {
  const ref = await addDoc(collection(db, 'achievements'), {
    ...a,
    submittedAt: new Date().toISOString(),
  });
  return ref.id;
};

export const getAchievementsByStudent = async (uid: string) => {
  const q = query(collection(db, 'achievements'), where('studentUid', '==', uid));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as AchievementDoc));
};
