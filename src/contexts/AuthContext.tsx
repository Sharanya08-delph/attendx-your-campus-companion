import React, { createContext, useContext, useState, useEffect } from 'react';
import { signUp, signIn, logOut, onAuthChange } from '@/lib/auth';
import {
  createUser,
  getUser,
  getUsersByRole,
  getAllUsers as fetchAllUsers,
  saveAttendanceRecord,
  getAttendanceRecords as fetchAttendanceRecords,
  addODApplication as fireAddOD,
  getAllODApplications as fireGetAllODs,
  updateODStatus as fireUpdateODStatus,
  addAchievementDoc,
  getAchievementsByStudent,
  type FirestoreUser,
  type AttendanceDoc,
  type ODDoc,
  type AchievementDoc,
} from '@/lib/firestore';

export type UserRole = 'student' | 'faculty' | 'admin';

export interface Achievement {
  id: string;
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
}

export interface StudentData {
  uid: string;
  name: string;
  department: string;
  section: string;
  regNo: string;
  email: string;
  phone: string;
  attendance: number;
  achievements: Achievement[];
  odApplications: ODApplication[];
}

export interface FacultyData {
  uid: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  isHOD: boolean;
}

export interface TeamMember {
  name: string;
  regNo: string;
  department: string;
}

export interface ODApplication {
  id: string;
  eventName: string;
  date: string;
  time: string;
  venue: string;
  teamMembers: TeamMember[];
  proofUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  studentEmail?: string;
  studentName?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  department: string;
  section: string;
  period: string;
  records: { regNo: string; name: string; present: boolean }[];
  savedBy: string;
  savedAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole | null;
  studentData: StudentData | null;
  facultyData: FacultyData | null;
  loading: boolean;
  login: (role: UserRole, email: string, password: string) => Promise<boolean>;
  registerStudent: (data: Omit<StudentData, 'uid' | 'attendance' | 'achievements' | 'odApplications'> & { password: string }) => Promise<boolean>;
  registerFaculty: (data: Omit<FacultyData, 'uid'> & { password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  addODApplication: (od: Omit<ODApplication, 'id' | 'status' | 'submittedAt'>) => Promise<void>;
  addAchievement: (achievement: Omit<Achievement, 'id' | 'verified' | 'submittedAt'>) => Promise<void>;
  saveAttendance: (record: Omit<AttendanceRecord, 'id' | 'savedAt'>) => Promise<void>;
  getAttendanceRecords: (department: string, section: string) => Promise<AttendanceRecord[]>;
  getAllStudents: () => Promise<StudentData[]>;
  getAllFaculty: () => Promise<FacultyData[]>;
  getAllODApplications: () => Promise<ODApplication[]>;
  updateODStatus: (id: string, status: 'approved' | 'rejected') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const ADMIN_EMAIL = 'ritadmin@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [facultyData, setFacultyData] = useState<FacultyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUid, setCurrentUid] = useState<string | null>(null);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsub = onAuthChange(async (user) => {
      if (user) {
        setCurrentUid(user.uid);
        const fsUser = await getUser(user.uid);
        if (fsUser) {
          setIsAuthenticated(true);
          setRole(fsUser.role);
          if (fsUser.role === 'student') {
            const achievements = await getAchievementsByStudent(user.uid);
            const allODs = await fireGetAllODs();
            const myODs = allODs.filter(od => od.studentUid === user.uid);
            setStudentData({
              uid: fsUser.uid,
              name: fsUser.name,
              department: fsUser.department,
              section: fsUser.section || '',
              regNo: fsUser.regNo || '',
              email: fsUser.email,
              phone: fsUser.phone,
              attendance: Math.floor(Math.random() * 30) + 65,
              achievements: achievements.map(a => ({ ...a, id: a.id! })),
              odApplications: myODs.map(od => ({ ...od, id: od.id! })),
            });
          } else if (fsUser.role === 'faculty') {
            setFacultyData({
              uid: fsUser.uid,
              name: fsUser.name,
              email: fsUser.email,
              phone: fsUser.phone,
              department: fsUser.department,
              isHOD: fsUser.isHOD || false,
            });
          }
          // admin has no extra data
        } else if (user.email === ADMIN_EMAIL) {
          setIsAuthenticated(true);
          setRole('admin');
        }
      } else {
        setIsAuthenticated(false);
        setRole(null);
        setStudentData(null);
        setFacultyData(null);
        setCurrentUid(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const registerStudent = async (data: Omit<StudentData, 'uid' | 'attendance' | 'achievements' | 'odApplications'> & { password: string }): Promise<boolean> => {
    try {
      const { password, ...rest } = data;
      const cred = await signUp(data.email, password);
      await createUser({
        uid: cred.user.uid,
        name: rest.name,
        email: rest.email,
        regNo: rest.regNo,
        department: rest.department,
        section: rest.section,
        phone: rest.phone,
        role: 'student',
      });
      return true;
    } catch (e: any) {
      console.error('Register student error:', e);
      return false;
    }
  };

  const registerFaculty = async (data: Omit<FacultyData, 'uid'> & { password: string }): Promise<boolean> => {
    try {
      const { password, ...rest } = data;
      const cred = await signUp(data.email, password);
      await createUser({
        uid: cred.user.uid,
        name: rest.name,
        email: rest.email,
        department: rest.department,
        phone: rest.phone,
        role: 'faculty',
        isHOD: rest.isHOD,
      });
      return true;
    } catch (e: any) {
      console.error('Register faculty error:', e);
      return false;
    }
  };

  const login = async (r: UserRole, email: string, password: string): Promise<boolean> => {
    try {
      await signIn(email, password);
      // onAuthChange will handle setting state
      return true;
    } catch (e: any) {
      console.error('Login error:', e);
      return false;
    }
  };

  const logout = async () => {
    await logOut();
  };

  const addODApplication = async (od: Omit<ODApplication, 'id' | 'status' | 'submittedAt'>) => {
    if (!studentData || !currentUid) return;
    const id = await fireAddOD({
      ...od,
      studentEmail: studentData.email,
      studentName: studentData.name,
      studentUid: currentUid,
    });
    const newOD: ODApplication = {
      ...od,
      id,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      studentEmail: studentData.email,
      studentName: studentData.name,
    };
    setStudentData(prev => prev ? { ...prev, odApplications: [...prev.odApplications, newOD] } : prev);
  };

  const addAchievement = async (achievement: Omit<Achievement, 'id' | 'verified' | 'submittedAt'>) => {
    if (!studentData || !currentUid) return;
    const id = await addAchievementDoc({
      ...achievement,
      verified: !!achievement.photoUrl,
      studentUid: currentUid,
    });
    const newA: Achievement = {
      ...achievement,
      id,
      verified: !!achievement.photoUrl,
      submittedAt: new Date().toISOString(),
    };
    setStudentData(prev => prev ? { ...prev, achievements: [...prev.achievements, newA] } : prev);
  };

  const saveAttendance = async (record: Omit<AttendanceRecord, 'id' | 'savedAt'>) => {
    await saveAttendanceRecord(record);
  };

  const getAttendanceRecordsFn = async (department: string, section: string): Promise<AttendanceRecord[]> => {
    const docs = await fetchAttendanceRecords(department, section);
    return docs.map(d => ({ ...d, id: d.id! }));
  };

  const getAllStudents = async (): Promise<StudentData[]> => {
    const users = await getUsersByRole('student');
    return users.map(u => ({
      uid: u.uid,
      name: u.name,
      department: u.department,
      section: u.section || '',
      regNo: u.regNo || '',
      email: u.email,
      phone: u.phone,
      attendance: Math.floor(Math.random() * 30) + 65,
      achievements: [],
      odApplications: [],
    }));
  };

  const getAllFaculty = async (): Promise<FacultyData[]> => {
    const users = await getUsersByRole('faculty');
    return users.map(u => ({
      uid: u.uid,
      name: u.name,
      email: u.email,
      phone: u.phone,
      department: u.department,
      isHOD: u.isHOD || false,
    }));
  };

  const getAllODApplications = async (): Promise<ODApplication[]> => {
    const docs = await fireGetAllODs();
    return docs.map(d => ({ ...d, id: d.id! }));
  };

  const updateODStatusFn = async (id: string, status: 'approved' | 'rejected') => {
    await fireUpdateODStatus(id, status);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated, role, studentData, facultyData, loading,
      login, registerStudent, registerFaculty, logout,
      addODApplication, addAchievement,
      saveAttendance, getAttendanceRecords: getAttendanceRecordsFn,
      getAllStudents, getAllFaculty, getAllODApplications, updateODStatus: updateODStatusFn,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
