import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'student' | 'faculty' | 'admin';

export interface StudentData {
  name: string;
  department: string;
  section: string;
  regNo: string;
  email: string;
  phone: string;
  attendance: number;
  achievements: string[];
  odApplications: ODApplication[];
}

export interface FacultyData {
  name: string;
  email: string;
  phone: string;
}

export interface ODApplication {
  id: string;
  eventName: string;
  date: string;
  time: string;
  venue: string;
  proofUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole | null;
  studentData: StudentData | null;
  facultyData: FacultyData | null;
  login: (role: UserRole, email: string, password: string) => boolean;
  registerStudent: (data: Omit<StudentData, 'attendance' | 'achievements' | 'odApplications'> & { password: string }) => boolean;
  registerFaculty: (data: FacultyData & { password: string }) => boolean;
  logout: () => void;
  addODApplication: (od: Omit<ODApplication, 'id' | 'status' | 'submittedAt'>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [facultyData, setFacultyData] = useState<FacultyData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('attendx_session');
    if (saved) {
      const session = JSON.parse(saved);
      setIsAuthenticated(true);
      setRole(session.role);
      if (session.role === 'student') setStudentData(session.data);
      if (session.role === 'faculty') setFacultyData(session.data);
    }
  }, []);

  const saveSession = (r: UserRole, data: any) => {
    localStorage.setItem('attendx_session', JSON.stringify({ role: r, data }));
  };

  const registerStudent = (data: Omit<StudentData, 'attendance' | 'achievements' | 'odApplications'> & { password: string }) => {
    const { password, ...rest } = data;
    const students = JSON.parse(localStorage.getItem('attendx_students') || '[]');
    if (students.find((s: any) => s.email === data.email)) return false;
    const student: StudentData = { ...rest, attendance: Math.floor(Math.random() * 30) + 65, achievements: [], odApplications: [] };
    students.push({ ...student, password });
    localStorage.setItem('attendx_students', JSON.stringify(students));
    setStudentData(student);
    setRole('student');
    setIsAuthenticated(true);
    saveSession('student', student);
    return true;
  };

  const registerFaculty = (data: FacultyData & { password: string }) => {
    const { password, ...rest } = data;
    const faculty = JSON.parse(localStorage.getItem('attendx_faculty') || '[]');
    if (faculty.find((f: any) => f.email === data.email)) return false;
    faculty.push({ ...rest, password });
    localStorage.setItem('attendx_faculty', JSON.stringify(faculty));
    setFacultyData(rest);
    setRole('faculty');
    setIsAuthenticated(true);
    saveSession('faculty', rest);
    return true;
  };

  const login = (r: UserRole, email: string, password: string) => {
    if (r === 'admin') {
      if (email === 'ritadmin@gmail.com' && password === 'rit123') {
        setRole('admin');
        setIsAuthenticated(true);
        saveSession('admin', { email });
        return true;
      }
      return false;
    }
    if (r === 'student') {
      const students = JSON.parse(localStorage.getItem('attendx_students') || '[]');
      const found = students.find((s: any) => s.email === email && s.password === password);
      if (found) {
        const { password: _, ...data } = found;
        setStudentData(data);
        setRole('student');
        setIsAuthenticated(true);
        saveSession('student', data);
        return true;
      }
      return false;
    }
    if (r === 'faculty') {
      const faculty = JSON.parse(localStorage.getItem('attendx_faculty') || '[]');
      const found = faculty.find((f: any) => f.email === email && f.password === password);
      if (found) {
        const { password: _, ...data } = found;
        setFacultyData(data);
        setRole('faculty');
        setIsAuthenticated(true);
        saveSession('faculty', data);
        return true;
      }
      return false;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    setStudentData(null);
    setFacultyData(null);
    localStorage.removeItem('attendx_session');
  };

  const addODApplication = (od: Omit<ODApplication, 'id' | 'status' | 'submittedAt'>) => {
    if (!studentData) return;
    const newOD: ODApplication = {
      ...od,
      id: crypto.randomUUID(),
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    const updated = { ...studentData, odApplications: [...studentData.odApplications, newOD] };
    setStudentData(updated);
    saveSession('student', updated);
    // Also update localStorage
    const students = JSON.parse(localStorage.getItem('attendx_students') || '[]');
    const idx = students.findIndex((s: any) => s.email === studentData.email);
    if (idx >= 0) {
      students[idx] = { ...students[idx], odApplications: updated.odApplications };
      localStorage.setItem('attendx_students', JSON.stringify(students));
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, studentData, facultyData, login, registerStudent, registerFaculty, logout, addODApplication }}>
      {children}
    </AuthContext.Provider>
  );
};
