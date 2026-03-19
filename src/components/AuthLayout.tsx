import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-body">Back to Home</span>
        </button>

        <div className="bg-card rounded-2xl shadow-elevated p-8 border border-border/50">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-card-foreground">AttendX-RIT</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-card-foreground mt-4">{title}</h2>
          <p className="text-muted-foreground text-sm font-body mb-6">{subtitle}</p>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
