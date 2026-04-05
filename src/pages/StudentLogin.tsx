import { useState } from 'react';
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
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith('.ritchennai.edu.in')) {
      toast.error('Use only college mail ID');
      return;
    }
    setLoading(true);
    const ok = await login('student', email, password);
    setLoading(false);
    if (ok) {
      toast.success('Welcome back!');
      navigate('/student/dashboard');
    } else {
      toast.error('Invalid credentials. Please try again.');
    }
  };

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
        <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          New user? <Link to="/student/register" className="text-primary font-semibold hover:underline">Create Account</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default StudentLogin;
