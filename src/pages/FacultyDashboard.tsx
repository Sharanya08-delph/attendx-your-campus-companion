import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Users, FileText, BarChart3, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const FacultyDashboard = () => {
  const { facultyData, logout } = useAuth();
  const navigate = useNavigate();

  if (!facultyData) {
    navigate('/faculty/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out');
  };

  const stats = [
    { label: 'Total Students', value: '120', icon: Users, color: 'text-primary' },
    { label: 'OD Requests', value: '5', icon: FileText, color: 'text-warning' },
    { label: 'Avg Attendance', value: '82%', icon: BarChart3, color: 'text-success' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-primary shadow-elevated">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-7 h-7 text-primary-foreground" />
            <h1 className="text-xl font-display font-bold text-primary-foreground">AttendX-RIT</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-primary-foreground/70 font-body hidden sm:block">{facultyData.name}</span>
            <Button onClick={handleLogout} variant="secondary" size="sm" className="gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">Welcome, {facultyData.name}! 👋</h2>
            <p className="text-muted-foreground text-sm">Faculty Dashboard</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-5 shadow-card border border-border">
                <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
                <p className="text-2xl font-display font-bold text-card-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-card rounded-xl p-6 shadow-card border border-border">
            <h3 className="font-display font-bold text-card-foreground mb-4">Recent OD Requests</h3>
            <p className="text-sm text-muted-foreground text-center py-8">No pending OD requests</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default FacultyDashboard;
