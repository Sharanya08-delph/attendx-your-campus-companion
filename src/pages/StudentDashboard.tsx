import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Home, FileText, Bell, Award, ChevronRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Tab = 'home' | 'od' | 'profile';

const StudentDashboard = () => {
  const { studentData, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showProfile, setShowProfile] = useState(false);

  if (!studentData) {
    navigate('/student/login');
    return null;
  }

  const attendanceColor = studentData.attendance >= 75 ? 'text-success' : 'text-destructive';
  const attendanceBg = studentData.attendance >= 75 ? 'bg-success/10 border-success/30' : 'bg-destructive/10 border-destructive/30';

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="gradient-primary sticky top-0 z-50 shadow-elevated">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-display font-bold text-primary-foreground">AttendX-RIT</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (studentData.attendance < 75) toast.warning('⚠️ Your attendance is below 75%! Please attend classes regularly.');
              }}
              className="relative p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
            >
              <Bell className="w-5 h-5 text-primary-foreground" />
              {studentData.attendance < 75 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
              )}
            </button>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="w-9 h-9 rounded-full gradient-primary border-2 border-primary-foreground/30 flex items-center justify-center font-display font-bold text-primary-foreground text-sm"
            >
              {studentData.name.charAt(0)}
            </button>
          </div>
        </div>
      </header>

      {/* Profile Dropdown */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 right-4 z-50 bg-card rounded-xl shadow-elevated border border-border p-5 w-72"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-lg">
                {studentData.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-display font-bold text-card-foreground">{studentData.name}</h3>
                <p className="text-xs text-muted-foreground">{studentData.email}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm border-t border-border pt-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Reg No</span><span className="font-semibold text-card-foreground">{studentData.regNo}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Dept</span><span className="font-semibold text-card-foreground">{studentData.department} - {studentData.section}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="font-semibold text-card-foreground">{studentData.phone}</span></div>
            </div>
            <Button onClick={handleLogout} variant="destructive" className="w-full mt-4 gap-2" size="sm">
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground">Welcome, {studentData.name.split(' ')[0]}! 👋</h2>
                <p className="text-muted-foreground text-sm mt-1">Here's your attendance overview</p>
              </div>

              {/* Attendance Card */}
              <div className={`rounded-2xl border-2 p-6 ${attendanceBg} transition-all`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-foreground">Overall Attendance</h3>
                  {studentData.attendance < 75 && <AlertTriangle className="w-5 h-5 text-destructive" />}
                </div>
                <div className="flex items-end gap-2">
                  <span className={`text-5xl font-display font-bold ${attendanceColor}`}>{studentData.attendance}%</span>
                  <span className="text-muted-foreground text-sm mb-2">/ 100%</span>
                </div>
                <div className="mt-4 h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${studentData.attendance >= 75 ? 'bg-success' : 'bg-destructive'}`}
                    style={{ width: `${studentData.attendance}%` }}
                  />
                </div>
                {studentData.attendance < 75 && (
                  <p className="text-sm text-destructive mt-3 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> Your attendance is below 75%. Please attend classes regularly!
                  </p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setActiveTab('od')} className="bg-card rounded-xl p-4 shadow-card border border-border hover:shadow-elevated transition-all text-left group">
                  <FileText className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-display font-bold text-card-foreground text-sm">OD Application</h4>
                  <p className="text-xs text-muted-foreground mt-1">Apply for On-Duty</p>
                  <ChevronRight className="w-4 h-4 text-primary mt-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="bg-card rounded-xl p-4 shadow-card border border-border text-left">
                  <Award className="w-8 h-8 text-warning mb-2" />
                  <h4 className="font-display font-bold text-card-foreground text-sm">Achievements</h4>
                  <p className="text-xs text-muted-foreground mt-1">{studentData.achievements.length} recorded</p>
                </div>
              </div>

              {/* OD History */}
              <div>
                <h3 className="font-display font-bold text-foreground mb-3">Recent OD Applications</h3>
                {studentData.odApplications.length === 0 ? (
                  <div className="bg-card rounded-xl p-6 shadow-card border border-border text-center">
                    <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No OD applications yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {studentData.odApplications.map(od => (
                      <div key={od.id} className="bg-card rounded-xl p-4 shadow-card border border-border">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-card-foreground">{od.eventName}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            od.status === 'approved' ? 'bg-success/10 text-success' :
                            od.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                            'bg-warning/10 text-warning'
                          }`}>{od.status}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{od.date} • {od.venue}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'od' && (
            <motion.div key="od" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <ODApplicationForm onBack={() => setActiveTab('home')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-elevated z-40">
        <div className="container mx-auto flex justify-around py-2">
          {[
            { id: 'home' as Tab, icon: Home, label: 'Home' },
            { id: 'od' as Tab, icon: FileText, label: 'OD Apply' },
            { id: 'profile' as Tab, icon: User, label: 'Profile' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => tab.id === 'profile' ? setShowProfile(!showProfile) : setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-colors ${activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs font-semibold">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

// OD Application Form Component
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload } from 'lucide-react';

const ODApplicationForm = ({ onBack }: { onBack: () => void }) => {
  const { addODApplication } = useAuth();
  const [form, setForm] = useState({ eventName: '', date: '', time: '', venue: '' });
  const [proof, setProof] = useState<File | null>(null);

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addODApplication({
      ...form,
      proofUrl: proof ? URL.createObjectURL(proof) : undefined,
    });
    toast.success('OD Application submitted successfully!');
    onBack();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">OD Application</h2>
          <p className="text-sm text-muted-foreground">Submit your On-Duty request</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 shadow-card border border-border space-y-4">
        <div className="space-y-2">
          <Label htmlFor="eventName">Event Name</Label>
          <Input id="eventName" placeholder="e.g. National Hackathon 2026" value={form.eventName} onChange={e => update('eventName', e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={form.date} onChange={e => update('date', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input id="time" type="time" value={form.time} onChange={e => update('time', e.target.value)} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="venue">Venue</Label>
          <Input id="venue" placeholder="e.g. Anna University, Chennai" value={form.venue} onChange={e => update('venue', e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Proof (Photo/Document)</Label>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary/50 transition-colors bg-muted/30">
            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">{proof ? proof.name : 'Click to upload proof'}</span>
            <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => setProof(e.target.files?.[0] || null)} />
          </label>
        </div>
        <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold">Submit Application</Button>
      </form>
    </div>
  );
};

export default StudentDashboard;
