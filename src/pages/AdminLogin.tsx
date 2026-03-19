import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login('admin', email, password)) {
      toast.success('Welcome, Admin!');
      navigate('/admin/dashboard');
    } else {
      toast.error('Invalid admin credentials');
    }
  };

  return (
    <AuthLayout title="Admin Login" subtitle="System administration access">
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Admin Email</Label>
          <Input id="email" type="email" placeholder="admin@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div className="text-sm">
          <Link to="/forgot-password" className="text-primary hover:underline">Forgot Password?</Link>
        </div>
        <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold">Sign In</Button>
      </form>
    </AuthLayout>
  );
};

export default AdminLogin;
