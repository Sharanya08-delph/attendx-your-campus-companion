import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML'];

const FacultyRegister = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', department: '', isHOD: false });
  const { registerFaculty } = useAuth();
  const navigate = useNavigate();

  const update = (key: string, value: string | boolean) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.endsWith('.ritchennai.edu.in')) {
      toast.error('Use only college mail ID');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (!form.department) {
      toast.error('Select your department');
      return;
    }
    const { confirmPassword, ...data } = form;
    if (registerFaculty(data)) {
      toast.success('Account created!');
      navigate('/faculty/dashboard');
    } else {
      toast.error('An account with this email already exists');
    }
  };

  return (
    <AuthLayout title="Faculty Registration" subtitle="Create your AttendX faculty account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="Dr. John Doe" value={form.name} onChange={e => update('name', e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">College Email</Label>
          <Input id="email" type="email" placeholder="yourname@cse.ritchennai.edu.in" value={form.email} onChange={e => update('email', e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" type="tel" placeholder="9876543210" value={form.phone} onChange={e => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} required />
        </div>
        <div className="space-y-2">
          <Label>Department</Label>
          <Select value={form.department} onValueChange={v => update('department', v)}>
            <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
            <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between py-2 px-1">
          <Label htmlFor="hod" className="cursor-pointer">Are you the HOD?</Label>
          <Switch id="hod" checked={form.isHOD} onCheckedChange={v => update('isHOD', v)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••" value={form.password} onChange={e => update('password', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm</Label>
            <Input id="confirmPassword" type="password" placeholder="••••••" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} required />
          </div>
        </div>
        <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold">Create Account</Button>
        <p className="text-center text-sm text-muted-foreground">
          Already registered? <Link to="/faculty/login" className="text-primary font-semibold hover:underline">Sign In</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default FacultyRegister;
