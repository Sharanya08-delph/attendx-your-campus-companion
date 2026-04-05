import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, Users, GraduationCap, Shield, BarChart3, BookOpen, Menu,
  User, Search, FileText, Check, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { StudentData, FacultyData, ODApplication } from '@/contexts/AuthContext';

type AdminTab = 'overview' | 'students' | 'faculty' | 'od-requests';

const AdminDashboard = () => {
  const { logout, getAllStudents, getAllFaculty, getAllODApplications, updateODStatus } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out');
  };

  const navItems = [
    { id: 'overview' as AdminTab, icon: BarChart3, label: 'Overview' },
    { id: 'students' as AdminTab, icon: Users, label: 'Students' },
    { id: 'faculty' as AdminTab, icon: BookOpen, label: 'Faculty' },
    { id: 'od-requests' as AdminTab, icon: FileText, label: 'OD Requests' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 lg:z-auto h-screen w-64 bg-card border-r border-border shadow-card flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <Shield className="w-7 h-7 text-primary" />
            <h1 className="text-lg font-display font-bold text-foreground">AttendX Admin</h1>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === item.id ? 'gradient-primary text-primary-foreground shadow-card' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}>
              <item.icon className="w-5 h-5" />{item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Button onClick={handleLogout} variant="outline" size="sm" className="w-full gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="lg:hidden gradient-primary sticky top-0 z-30 shadow-elevated">
          <div className="px-4 py-3 flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg bg-primary-foreground/10">
              <Menu className="w-5 h-5 text-primary-foreground" />
            </button>
            <h1 className="text-lg font-display font-bold text-primary-foreground">AttendX Admin</h1>
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && <OverviewTab key="ov" />}
            {activeTab === 'students' && <StudentsTab key="st" />}
            {activeTab === 'faculty' && <FacultyTab key="fc" />}
            {activeTab === 'od-requests' && <AdminODTab key="od" />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

/* ── Overview ── */
const OverviewTab = () => {
  const { getAllStudents, getAllFaculty, getAllODApplications } = useAuth();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [faculty, setFaculty] = useState<FacultyData[]>([]);
  const [ods, setOds] = useState<ODApplication[]>([]);

  useEffect(() => {
    getAllStudents().then(setStudents);
    getAllFaculty().then(setFaculty);
    getAllODApplications().then(setOds);
  }, []);

  const stats = [
    { label: 'Total Students', value: students.length, icon: Users, color: 'text-primary' },
    { label: 'Total Faculty', value: faculty.length, icon: BookOpen, color: 'text-accent' },
    { label: 'Avg Attendance', value: students.length ? `${Math.round(students.reduce((a, s) => a + s.attendance, 0) / students.length)}%` : '0%', icon: BarChart3, color: 'text-success' },
    { label: 'OD Requests', value: ods.length, icon: FileText, color: 'text-warning' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Dashboard Overview 🛡️</h2>
        <p className="text-muted-foreground text-sm">System-wide statistics</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl p-5 shadow-card border border-border">
            <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
            <p className="text-2xl font-display font-bold text-card-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent students */}
      {students.length > 0 && (
        <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
          <div className="p-4 border-b border-border"><h3 className="font-display font-bold text-foreground">Recent Students</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                <th className="text-left p-3 text-muted-foreground font-semibold">Name</th>
                <th className="text-left p-3 text-muted-foreground font-semibold hidden sm:table-cell">Reg No</th>
                <th className="text-left p-3 text-muted-foreground font-semibold hidden md:table-cell">Dept</th>
                <th className="text-left p-3 text-muted-foreground font-semibold">Attendance</th>
              </tr></thead>
              <tbody>{students.slice(0, 5).map(s => (
                <tr key={s.email} className="border-b border-border hover:bg-muted/30">
                  <td className="p-3 font-semibold text-foreground">{s.name}</td>
                  <td className="p-3 text-muted-foreground hidden sm:table-cell">{s.regNo}</td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{s.department} - {s.section}</td>
                  <td className="p-3"><span className={`font-bold ${s.attendance >= 75 ? 'text-success' : 'text-destructive'}`}>{s.attendance}%</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

/* ── Students Tab ── */
const StudentsTab = () => {
  const { getAllStudents } = useAuth();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => { getAllStudents().then(setStudents); }, []);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.regNo.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Students 🎓</h2>
          <p className="text-muted-foreground text-sm">{students.length} registered students</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search students..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border text-center">
          <Users className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">{students.length === 0 ? 'No students registered yet' : 'No matches found'}</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                <th className="text-left p-3 text-muted-foreground font-semibold">Name</th>
                <th className="text-left p-3 text-muted-foreground font-semibold hidden sm:table-cell">Reg No</th>
                <th className="text-left p-3 text-muted-foreground font-semibold hidden md:table-cell">Department</th>
                <th className="text-left p-3 text-muted-foreground font-semibold hidden lg:table-cell">Email</th>
                <th className="text-left p-3 text-muted-foreground font-semibold hidden lg:table-cell">Phone</th>
                <th className="text-left p-3 text-muted-foreground font-semibold">Attendance</th>
                <th className="text-left p-3 text-muted-foreground font-semibold hidden md:table-cell">ODs</th>
              </tr></thead>
              <tbody>{filtered.map(s => (
                <tr key={s.email} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-semibold text-foreground">{s.name}</td>
                  <td className="p-3 font-mono text-muted-foreground text-xs hidden sm:table-cell">{s.regNo}</td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{s.department} - {s.section}</td>
                  <td className="p-3 text-muted-foreground text-xs hidden lg:table-cell">{s.email}</td>
                  <td className="p-3 text-muted-foreground hidden lg:table-cell">{s.phone}</td>
                  <td className="p-3"><span className={`font-bold ${s.attendance >= 75 ? 'text-success' : 'text-destructive'}`}>{s.attendance}%</span></td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{s.odApplications.length}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

/* ── Faculty Tab ── */
const FacultyTab = () => {
  const { getAllFaculty } = useAuth();
  const [faculty, setFaculty] = useState<FacultyData[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => { getAllFaculty().then(setFaculty); }, []);

  const filtered = faculty.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Faculty 📚</h2>
          <p className="text-muted-foreground text-sm">{faculty.length} registered faculty</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search faculty..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border text-center">
          <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">{faculty.length === 0 ? 'No faculty registered yet' : 'No matches found'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(f => (
            <div key={f.email} className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
              <div className="gradient-primary p-4 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground font-display font-bold text-lg">
                  {f.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-display font-bold text-primary-foreground">{f.name}</h4>
                  <p className="text-xs text-primary-foreground/70">{f.isHOD ? 'HOD' : 'Faculty'} • {f.department}</p>
                </div>
              </div>
              <div className="p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-foreground text-xs font-semibold truncate max-w-[160px]">{f.email}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="text-foreground font-semibold">{f.phone}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

/* ── Admin OD Requests ── */
const AdminODTab = () => {
  const { getAllODApplications, updateODStatus } = useAuth();
  const [odList, setOdList] = useState<ODApplication[]>([]);

  useEffect(() => { getAllODApplications().then(setOdList); }, []);

  const handleAction = (id: string, status: 'approved' | 'rejected') => {
    updateODStatus(id, status);
    setOdList(prev => prev.map(od => od.id === id ? { ...od, status } : od));
    toast.success(`OD ${status}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">All OD Requests 📋</h2>
        <p className="text-muted-foreground text-sm">{odList.length} total requests</p>
      </div>

      {odList.length === 0 ? (
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border text-center">
          <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No OD requests yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {odList.map(od => (
            <div key={od.id} className="bg-card rounded-2xl p-5 shadow-card border border-border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <div>
                  <h4 className="font-semibold text-foreground">{od.eventName}</h4>
                  <p className="text-xs text-muted-foreground">{od.studentName} • {od.date} • {od.venue}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-bold self-start ${
                  od.status === 'approved' ? 'bg-success/10 text-success' :
                  od.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                  'bg-warning/10 text-warning'
                }`}>{od.status}</span>
              </div>
              {od.status === 'pending' && (
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={() => handleAction(od.id, 'approved')} className="bg-success text-success-foreground hover:bg-success/90 gap-1">
                    <Check className="w-4 h-4" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAction(od.id, 'rejected')} className="text-destructive border-destructive/30 gap-1">
                    <X className="w-4 h-4" /> Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;
