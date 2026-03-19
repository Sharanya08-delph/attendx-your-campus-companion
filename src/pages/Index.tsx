import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import studentImg from '@/assets/student-role.png';
import facultyImg from '@/assets/faculty-role.png';
import adminImg from '@/assets/admin-role.png';
import { GraduationCap, BookOpen, Shield } from 'lucide-react';

const roles = [
  { id: 'student', title: 'Student', description: 'Track your attendance, apply for OD & manage your academic journey', image: studentImg, icon: GraduationCap, path: '/student/login' },
  { id: 'faculty', title: 'Faculty', description: 'Manage classes, mark attendance & approve student requests', image: facultyImg, icon: BookOpen, path: '/faculty/login' },
  { id: 'admin', title: 'Admin', description: 'Oversee the entire system, manage users & generate reports', image: adminImg, icon: Shield, path: '/admin/login' },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 pt-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-elevated">
              <GraduationCap className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground tracking-tight">
              Attend<span className="text-primary">X</span>-RIT
            </h1>
          </div>
          <p className="text-lg text-primary-foreground/60 font-body max-w-md mx-auto">
            Smart Attendance & OD Management System
          </p>
        </motion.header>

        {/* Role Cards */}
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
            {roles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => navigate(role.path)}
                className="group cursor-pointer"
              >
                <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 border border-border/50 hover:border-primary/30 h-full flex flex-col items-center text-center">
                  <div className="w-40 h-40 mb-4 relative">
                    <div className="absolute inset-0 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors" />
                    <img src={role.image} alt={role.title} className="w-full h-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="inline-flex items-center gap-2 mb-2">
                    <role.icon className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-display font-bold text-card-foreground">{role.title}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">{role.description}</p>
                  <div className="mt-auto gradient-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold text-sm group-hover:animate-pulse-glow transition-all">
                    Continue →
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center py-6 text-primary-foreground/40 text-sm font-body"
        >
          © 2026 AttendX-RIT • Rajalakshmi Institute of Technology
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
