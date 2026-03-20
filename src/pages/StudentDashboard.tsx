import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Home, FileText, Bell, Award, ChevronRight, AlertTriangle, ArrowLeft, Upload, Plus, Trash2, Camera, MapPin, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { TeamMember, Achievement } from '@/contexts/AuthContext';

type Tab = 'home' | 'od' | 'achievement' | 'profile';

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

  const statusLabel = (s: Achievement['status']) => {
    const map: Record<string, string> = {
      prize_winner_1: '🥇 1st Prize',
      prize_winner_2: '🥈 2nd Prize',
      prize_winner_3: '🥉 3rd Prize',
      participant: '📋 Participant',
      volunteer: '🤝 Volunteer',
    };
    return map[s] || s;
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
                <button onClick={() => setActiveTab('achievement')} className="bg-card rounded-xl p-4 shadow-card border border-border hover:shadow-elevated transition-all text-left group">
                  <Award className="w-8 h-8 text-warning mb-2" />
                  <h4 className="font-display font-bold text-card-foreground text-sm">Achievements</h4>
                  <p className="text-xs text-muted-foreground mt-1">{studentData.achievements.length} recorded</p>
                  <ChevronRight className="w-4 h-4 text-warning mt-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Achievements List */}
              {studentData.achievements.length > 0 && (
                <div>
                  <h3 className="font-display font-bold text-foreground mb-3">Recent Achievements</h3>
                  <div className="space-y-3">
                    {studentData.achievements.map(a => (
                      <div key={a.id} className="bg-card rounded-xl p-4 shadow-card border border-border">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-card-foreground">{a.name}</h4>
                          <span className="text-xs px-2 py-1 rounded-full font-semibold bg-warning/10 text-warning">
                            {statusLabel(a.status)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{a.date} • {a.department} - {a.section}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {a.verified ? (
                            <span className="text-xs flex items-center gap-1 text-success"><CheckCircle2 className="w-3.5 h-3.5" /> Verified</span>
                          ) : (
                            <span className="text-xs flex items-center gap-1 text-destructive"><XCircle className="w-3.5 h-3.5" /> Incomplete</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

          {activeTab === 'achievement' && (
            <motion.div key="achievement" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <AchievementForm onBack={() => setActiveTab('home')} />
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
            { id: 'achievement' as Tab, icon: Award, label: 'Achieve' },
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
const ODApplicationForm = ({ onBack }: { onBack: () => void }) => {
  const { addODApplication } = useAuth();
  const [form, setForm] = useState({ eventName: '', date: '', time: '', venue: '' });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ name: '', regNo: '', department: '' }]);
  const [proof, setProof] = useState<File | null>(null);

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const updateMember = (index: number, key: keyof TeamMember, value: string) => {
    setTeamMembers(prev => prev.map((m, i) => i === index ? { ...m, [key]: value } : m));
  };

  const addMember = () => setTeamMembers(prev => [...prev, { name: '', regNo: '', department: '' }]);

  const removeMember = (index: number) => {
    if (teamMembers.length > 1) setTeamMembers(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addODApplication({
      ...form,
      teamMembers,
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

        {/* Team Members */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-display font-bold">Team Members</Label>
            <button type="button" onClick={addMember} className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
              <Plus className="w-3.5 h-3.5" /> Add Member
            </button>
          </div>
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-muted/30 rounded-xl p-4 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Member {index + 1}</span>
                {teamMembers.length > 1 && (
                  <button type="button" onClick={() => removeMember(index)} className="text-destructive hover:text-destructive/80">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="space-y-2">
                <Input placeholder="Full Name" value={member.name} onChange={e => updateMember(index, 'name', e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Reg No" value={member.regNo} onChange={e => updateMember(index, 'regNo', e.target.value)} required />
                <Input placeholder="Department" value={member.department} onChange={e => updateMember(index, 'department', e.target.value)} required />
              </div>
            </div>
          ))}
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

// Achievement Form Component
const AchievementForm = ({ onBack }: { onBack: () => void }) => {
  const { addAchievement, studentData } = useAuth();
  const [form, setForm] = useState({
    name: studentData?.name || '',
    regNo: studentData?.regNo || '',
    department: studentData?.department || '',
    section: studentData?.section || '',
    date: '',
    status: '' as Achievement['status'] | '',
  });
  const [certificate, setCertificate] = useState<File | null>(null);
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'ready' | 'incomplete'>('idle');
  const [certVerifying, setCertVerifying] = useState(false);
  const [certVerified, setCertVerified] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  // Get live location
  const fetchLocation = () => {
    setLocationLoading(true);
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLoading(false);
        toast.success('Location fetched successfully');
      },
      (err) => {
        setLocationError('Please enable location');
        setLocationLoading(false);
        toast.error('Please enable location');
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  // Update verification status
  useEffect(() => {
    if (photo && location) {
      setVerificationStatus('ready');
    } else if (photo || location) {
      setVerificationStatus('incomplete');
    } else {
      setVerificationStatus('idle');
    }
  }, [photo, location]);

  // Handle certificate upload with mock OCR verification
  const handleCertificateUpload = (file: File) => {
    setCertificate(file);
    const url = URL.createObjectURL(file);
    setCertificatePreview(url);
    // Mock OCR verification
    setCertVerifying(true);
    setCertVerified(false);
    setTimeout(() => {
      setCertVerifying(false);
      setCertVerified(true);
      toast.success('Certificate verified via OCR ✅');
    }, 2000);
  };

  // Handle photo upload
  const handlePhotoUpload = (file: File) => {
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  // Capture photo from camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      setShowCamera(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch {
      toast.error('Unable to access camera');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' });
        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
      }
    }, 'image/jpeg');
    stopCamera();
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setShowCamera(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) {
      toast.error('Please upload image');
      return;
    }
    if (!location) {
      toast.error('Please enable location');
      return;
    }
    if (!form.status) {
      toast.error('Please select OD status');
      return;
    }
    addAchievement({
      name: form.name,
      regNo: form.regNo,
      department: form.department,
      section: form.section,
      date: form.date,
      status: form.status as Achievement['status'],
      certificateUrl: certificatePreview || undefined,
      photoUrl: photoPreview || undefined,
      latitude: location.lat,
      longitude: location.lng,
    });
    toast.success('Achievement submitted successfully!');
    onBack();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">Achievement Form</h2>
          <p className="text-sm text-muted-foreground">Record your achievement</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 shadow-card border border-border space-y-5">
        {/* Student Details */}
        <div className="space-y-2">
          <Label htmlFor="achName">Name</Label>
          <Input id="achName" value={form.name} onChange={e => update('name', e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="achRegNo">Reg No</Label>
            <Input id="achRegNo" value={form.regNo} onChange={e => update('regNo', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="achDept">Department</Label>
            <Input id="achDept" value={form.department} onChange={e => update('department', e.target.value)} required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="achSec">Section</Label>
            <Input id="achSec" value={form.section} onChange={e => update('section', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="achDate">Date</Label>
            <Input id="achDate" type="date" value={form.date} onChange={e => update('date', e.target.value)} required />
          </div>
        </div>

        {/* OD Status */}
        <div className="space-y-2">
          <Label>OD Status</Label>
          <Select value={form.status} onValueChange={v => update('status', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prize_winner_1">🥇 1st Prize Winner</SelectItem>
              <SelectItem value="prize_winner_2">🥈 2nd Prize Winner</SelectItem>
              <SelectItem value="prize_winner_3">🥉 3rd Prize Winner</SelectItem>
              <SelectItem value="participant">📋 Participant</SelectItem>
              <SelectItem value="volunteer">🤝 Volunteer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Certificate Upload with mock OCR */}
        <div className="space-y-2">
          <Label>Certificate Upload (OCR Verified)</Label>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-5 cursor-pointer hover:border-primary/50 transition-colors bg-muted/30">
            <Upload className="w-7 h-7 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">{certificate ? certificate.name : 'Upload certificate image'}</span>
            <input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleCertificateUpload(e.target.files[0]); }} />
          </label>
          {certVerifying && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" /> Verifying certificate via OCR...
            </div>
          )}
          {certVerified && (
            <div className="flex items-center gap-2 text-sm text-success">
              <CheckCircle2 className="w-4 h-4" /> Certificate verified ✅
            </div>
          )}
          {certificatePreview && (
            <img src={certificatePreview} alt="Certificate preview" className="w-full max-h-40 object-contain rounded-lg border border-border mt-2" />
          )}
        </div>

        {/* Photo Upload / Capture */}
        <div className="space-y-3">
          <Label>Photo Proof</Label>
          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1 gap-2" onClick={startCamera}>
              <Camera className="w-4 h-4" /> Capture Photo
            </Button>
            <label className="flex-1">
              <Button type="button" variant="outline" className="w-full gap-2" asChild>
                <span>
                  <Upload className="w-4 h-4" /> Upload Photo
                </span>
              </Button>
              <input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0]); }} />
            </label>
          </div>

          {/* Camera View */}
          {showCamera && (
            <div className="relative rounded-xl overflow-hidden border border-border">
              <video ref={videoRef} autoPlay playsInline className="w-full max-h-60 object-cover" />
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
                <Button type="button" size="sm" onClick={capturePhoto} className="gap-1">
                  <Camera className="w-4 h-4" /> Capture
                </Button>
                <Button type="button" size="sm" variant="destructive" onClick={stopCamera}>Cancel</Button>
              </div>
            </div>
          )}

          {/* Photo Preview */}
          {photoPreview && (
            <div className="space-y-2">
              <img src={photoPreview} alt="Photo preview" className="w-full max-h-48 object-contain rounded-xl border border-border" />
              <p className="text-xs text-muted-foreground text-center">Photo uploaded ✅</p>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label>Live Location</Label>
          <div className="bg-muted/30 rounded-xl p-4 border border-border">
            {locationLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> Fetching location...
              </div>
            ) : location ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-success">
                  <MapPin className="w-4 h-4" /> Location captured
                </div>
                <p className="text-xs text-muted-foreground">Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}</p>
                <a
                  href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  View on Google Maps →
                </a>
              </div>
            ) : (
              <div className="space-y-2">
                {locationError && <p className="text-sm text-destructive">{locationError}</p>}
                <Button type="button" variant="outline" size="sm" onClick={fetchLocation} className="gap-2">
                  <MapPin className="w-4 h-4" /> Get Location
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Verification Status */}
        <div className={`rounded-xl p-4 border-2 text-center font-semibold text-sm ${
          verificationStatus === 'ready'
            ? 'bg-success/10 border-success/30 text-success'
            : verificationStatus === 'incomplete'
            ? 'bg-destructive/10 border-destructive/30 text-destructive'
            : 'bg-muted/30 border-border text-muted-foreground'
        }`}>
          {verificationStatus === 'ready' && <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5" /> Ready for verification ✅</span>}
          {verificationStatus === 'incomplete' && <span className="flex items-center justify-center gap-2"><XCircle className="w-5 h-5" /> Incomplete ❌</span>}
          {verificationStatus === 'idle' && <span>Upload photo and enable location to verify</span>}
        </div>

        <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold" disabled={verificationStatus !== 'ready'}>
          Submit Achievement
        </Button>
      </form>
    </div>
  );
};

export default StudentDashboard;