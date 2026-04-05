import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, Users, FileText, BarChart3, GraduationCap, User, ChevronDown,
  Check, X, Save, Eye, Calendar, Clock, Menu, X as XIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { AttendanceRecord, ODApplication } from '@/contexts/AuthContext';

type FacultyTab = 'profile' | 'attendance' | 'od-requests';

const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML'];
const SECTIONS = ['A', 'B', 'C'];
const PERIODS = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6'];

// Mock students for attendance marking
const getMockStudents = (dept: string, sec: string) => {
  const names = [
    'Arun Kumar', 'Bharathi S', 'Chandru R', 'Deepika M', 'Ezhilan V',
    'Fathima N', 'Ganesh P', 'Harini K', 'Ilavarasan J', 'Janani L',
    'Karthik S', 'Lavanya R', 'Mohan T', 'Nithya V', 'Oviya P'
  ];
  return names.map((name, i) => ({
    regNo: `${dept}${sec}${String(i + 1).padStart(3, '0')}`,
    name,
    present: true,
  }));
};

const FacultyDashboard = () => {
  const { facultyData, logout, saveAttendance, getAttendanceRecords, getAllODApplications, updateODStatus } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FacultyTab>('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!facultyData) {
    navigate('/faculty/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out');
  };

  const navItems = [
    { id: 'profile' as FacultyTab, icon: User, label: 'My Profile' },
    { id: 'attendance' as FacultyTab, icon: BarChart3, label: 'Attendance' },
    ...(facultyData.isHOD ? [{ id: 'od-requests' as FacultyTab, icon: FileText, label: 'OD Requests' }] : []),
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 lg:z-auto h-screen w-64 bg-card border-r border-border shadow-card flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-7 h-7 text-primary" />
            <h1 className="text-lg font-display font-bold text-foreground">AttendX-RIT</h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Faculty Portal</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === item.id
                  ? 'gradient-primary text-primary-foreground shadow-card'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
              {facultyData.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{facultyData.name}</p>
              <p className="text-xs text-muted-foreground">{facultyData.isHOD ? 'HOD' : 'Faculty'} • {facultyData.department}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm" className="w-full gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar for mobile */}
        <header className="lg:hidden gradient-primary sticky top-0 z-30 shadow-elevated">
          <div className="px-4 py-3 flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg bg-primary-foreground/10">
              <Menu className="w-5 h-5 text-primary-foreground" />
            </button>
            <h1 className="text-lg font-display font-bold text-primary-foreground">AttendX-RIT</h1>
            <div className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground font-bold text-sm">
              {facultyData.name.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && <ProfileTab key="profile" facultyData={facultyData} />}
            {activeTab === 'attendance' && <AttendanceTab key="attendance" />}
            {activeTab === 'od-requests' && <ODRequestsTab key="od-requests" />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

/* ── Profile Tab ── */
const ProfileTab = ({ facultyData }: { facultyData: any }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
    <div>
      <h2 className="text-2xl font-display font-bold text-foreground">My Profile 👤</h2>
      <p className="text-muted-foreground text-sm">Your faculty details</p>
    </div>

    <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
      <div className="gradient-primary p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground font-display font-bold text-2xl border-2 border-primary-foreground/30">
          {facultyData.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-primary-foreground">{facultyData.name}</h3>
          <p className="text-primary-foreground/70 text-sm">{facultyData.isHOD ? 'Head of Department' : 'Faculty'}</p>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {[
          { label: 'Email', value: facultyData.email },
          { label: 'Phone', value: facultyData.phone },
          { label: 'Department', value: facultyData.department },
          { label: 'Designation', value: facultyData.isHOD ? 'HOD' : 'Faculty' },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="text-sm font-semibold text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

/* ── Attendance Tab ── */
const AttendanceTab = () => {
  const { saveAttendance, getAttendanceRecords, facultyData } = useAuth();
  const [mode, setMode] = useState<'mark' | 'view'>('mark');
  const [department, setDepartment] = useState('');
  const [section, setSection] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [period, setPeriod] = useState('');
  const [students, setStudents] = useState<{ regNo: string; name: string; present: boolean }[]>([]);
  const [viewRecords, setViewRecords] = useState<AttendanceRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  const loadStudents = () => {
    if (!department || !section) { toast.error('Select department and section'); return; }
    setStudents(getMockStudents(department, section));
    setLoaded(true);
  };

  const toggleStudent = (idx: number) => {
    setStudents(prev => prev.map((s, i) => i === idx ? { ...s, present: !s.present } : s));
  };

  const markAll = (present: boolean) => setStudents(prev => prev.map(s => ({ ...s, present })));

  const handleSave = () => {
    if (!period) { toast.error('Select period'); return; }
    saveAttendance({ date, department, section, period, records: students, savedBy: facultyData?.email || '' });
    toast.success('Attendance saved!');
    setLoaded(false);
    setStudents([]);
  };

  const loadRecords = async () => {
    if (!department || !section) { toast.error('Select department and section'); return; }
    const records = await getAttendanceRecords(department, section);
    setViewRecords(records);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Attendance 📊</h2>
          <p className="text-muted-foreground text-sm">Mark and view class attendance</p>
        </div>
        <div className="flex gap-2">
          <Button variant={mode === 'mark' ? 'default' : 'outline'} size="sm" onClick={() => setMode('mark')} className="gap-2">
            <Check className="w-4 h-4" /> Mark
          </Button>
          <Button variant={mode === 'view' ? 'default' : 'outline'} size="sm" onClick={() => setMode('view')} className="gap-2">
            <Eye className="w-4 h-4" /> View
          </Button>
        </div>
      </div>

      {/* Class selector */}
      <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger><SelectValue placeholder="Select Dept" /></SelectTrigger>
              <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Section</Label>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger><SelectValue placeholder="Select Section" /></SelectTrigger>
              <SelectContent>{SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {mode === 'mark' && (
            <>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Period</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger><SelectValue placeholder="Select Period" /></SelectTrigger>
                  <SelectContent>{PERIODS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
        <Button onClick={mode === 'mark' ? loadStudents : loadRecords} className="mt-4 gradient-primary text-primary-foreground gap-2">
          {mode === 'mark' ? <><Users className="w-4 h-4" /> Load Students</> : <><Eye className="w-4 h-4" /> View Records</>}
        </Button>
      </div>

      {/* Mark attendance */}
      {mode === 'mark' && loaded && students.length > 0 && (
        <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="font-display font-bold text-foreground">{department} - {section} • {date}</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => markAll(true)} className="text-success border-success/30">All Present</Button>
              <Button variant="outline" size="sm" onClick={() => markAll(false)} className="text-destructive border-destructive/30">All Absent</Button>
            </div>
          </div>
          <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
            {students.map((s, i) => (
              <div key={s.regNo} className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground w-16">{s.regNo}</span>
                  <span className="text-sm font-semibold text-foreground">{s.name}</span>
                </div>
                <button
                  onClick={() => toggleStudent(i)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all font-bold text-sm ${
                    s.present ? 'bg-success/15 text-success border border-success/30' : 'bg-destructive/15 text-destructive border border-destructive/30'
                  }`}
                >
                  {s.present ? 'P' : 'A'}
                </button>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border flex items-center justify-between bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Present: <span className="font-bold text-success">{students.filter(s => s.present).length}</span> / {students.length}
            </p>
            <Button onClick={handleSave} className="gradient-primary text-primary-foreground gap-2">
              <Save className="w-4 h-4" /> Save Attendance
            </Button>
          </div>
        </div>
      )}

      {/* View records */}
      {mode === 'view' && viewRecords.length > 0 && (
        <div className="space-y-4">
          {viewRecords.map(rec => (
            <div key={rec.id} className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
              <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{rec.date}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">{rec.period}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Present: {rec.records.filter(r => r.present).length}/{rec.records.length}
                </p>
              </div>
              <div className="divide-y divide-border max-h-[200px] overflow-y-auto">
                {rec.records.map(r => (
                  <div key={r.regNo} className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground">{r.regNo}</span>
                      <span className="text-sm text-foreground">{r.name}</span>
                    </div>
                    <span className={`text-xs font-bold ${r.present ? 'text-success' : 'text-destructive'}`}>
                      {r.present ? 'Present' : 'Absent'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === 'view' && viewRecords.length === 0 && department && section && (
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border text-center">
          <BarChart3 className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No attendance records found</p>
        </div>
      )}
    </motion.div>
  );
};

/* ── OD Requests Tab (HOD Only) ── */
const ODRequestsTab = () => {
  const { getAllODApplications, updateODStatus } = useAuth();
  const [odList, setOdList] = useState<ODApplication[]>([]);

  useEffect(() => { getAllODApplications().then(setOdList); }, []);

  const handleAction = (id: string, status: 'approved' | 'rejected') => {
    updateODStatus(id, status);
    setOdList(prev => prev.map(od => od.id === id ? { ...od, status } : od));
    toast.success(`OD ${status === 'approved' ? 'approved ✅' : 'rejected ❌'}`);
  };

  const pending = odList.filter(od => od.status === 'pending');
  const processed = odList.filter(od => od.status !== 'pending');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">OD Requests 📋</h2>
        <p className="text-muted-foreground text-sm">Review and approve student OD applications</p>
      </div>

      {/* Pending */}
      <div>
        <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-warning" /> Pending ({pending.length})
        </h3>
        {pending.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 shadow-card border border-border text-center">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No pending requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map(od => (
              <div key={od.id} className="bg-card rounded-2xl p-5 shadow-card border border-border space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-foreground">{od.eventName}</h4>
                    <p className="text-xs text-muted-foreground">{od.studentName} • {od.date} • {od.venue}</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-warning/10 text-warning font-bold self-start">Pending</span>
                </div>
                {od.teamMembers.length > 0 && (
                  <div className="bg-muted/30 rounded-xl p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Team Members:</p>
                    {od.teamMembers.map((m, i) => (
                      <p key={i} className="text-xs text-foreground">{m.name} ({m.regNo}) - {m.department}</p>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleAction(od.id, 'approved')} className="bg-success text-success-foreground hover:bg-success/90 gap-1">
                    <Check className="w-4 h-4" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAction(od.id, 'rejected')} className="text-destructive border-destructive/30 gap-1">
                    <X className="w-4 h-4" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Processed */}
      {processed.length > 0 && (
        <div>
          <h3 className="font-display font-bold text-foreground mb-3">Processed</h3>
          <div className="space-y-3">
            {processed.map(od => (
              <div key={od.id} className="bg-card rounded-xl p-4 shadow-card border border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-foreground text-sm">{od.eventName}</h4>
                  <p className="text-xs text-muted-foreground">{od.studentName} • {od.date}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-bold self-start ${
                  od.status === 'approved' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                }`}>{od.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FacultyDashboard;
