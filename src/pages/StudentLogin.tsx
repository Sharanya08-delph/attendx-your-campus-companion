import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, isAuthenticated, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated && role === 'student') {
      navigate('/student/dashboard');
    }
  }, [loading, isAuthenticated, role, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith('.ritchennai.edu.in')) {
      toast.error('Use only college mail id');
      return;
    }
    setSubmitting(true);
    const ok = await login('student', email, password);
    if (!ok) {
      setSubmitting(false);
      toast.error('Invalid credentials. Please try again.');
    }
  };

  useEffect(() => {
    if (!loading) {
      setSubmitting(false);
    }
  }, [loading]);

  return (
    <AuthLayout title="Student Login" subtitle="Access your attendance dashboard">
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">College Email</Label>
          <Input id="email" type="email" placeholder="Enter mail id" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div className="flex justify-between items-center text-sm">
          <Link to="/forgot-password" className="text-primary hover:underline">Forgot Password?</Link>
        </div>
        <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold" disabled={submitting || loading}>
          {submitting || loading ? 'Signing in...' : 'Sign In'}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          New user? <Link to="/student/register" className="text-primary font-semibold hover:underline">Create Account</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default StudentLogin;
