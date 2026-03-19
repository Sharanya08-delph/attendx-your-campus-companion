import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Users, GraduationCap, Shield, BarChart3, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out');
  };

  const stats = [
    { label: 'Total Students', value: '1,240', icon: Users, color: 'text-primary' },
    { label: 'Total Faculty', value: '85', icon: BookOpen, color: 'text-accent' },
    { label: 'Avg Attendance', value: '79%', icon: BarChart3, color: 'text-success' },
    { label: 'OD Requests', value: '23', icon: Shield, color: 'text-warning' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-primary shadow-elevated">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-7 h-7 text-primary-foreground" />
            <h1 className="text-xl font-display font-bold text-primary-foreground">AttendX-RIT Admin</h1>
          </div>
          <Button onClick={handleLogout} variant="secondary" size="sm" className="gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">Admin Dashboard 🛡️</h2>
            <p className="text-muted-foreground text-sm">System overview and management</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-5 shadow-card border border-border">
                <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
                <p className="text-2xl font-display font-bold text-card-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
