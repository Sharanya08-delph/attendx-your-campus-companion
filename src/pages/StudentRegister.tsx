import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const departments = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML', 'CSE(CS)'];
const sections = ['A', 'B', 'C', 'D'];

const StudentRegister = () => {
  const [form, setForm] = useState({ name: '', department: '', section: '', regNo: '', email: '', phone: '', password: '', confirmPassword: '' });
  const { registerStudent } = useAuth();
  const navigate = useNavigate();

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

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
    if (form.phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    const { confirmPassword, ...data } = form;
    if (registerStudent(data)) {
      toast.success('Account created successfully!');
      navigate('/student/dashboard');
    } else {
      toast.error('An account with this email already exists');
    }
  };

  return (
    <AuthLayout title="Student Registration" subtitle="Create your AttendX account">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="John Doe" value={form.name} onChange={e => update('name', e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Department</Label>
            <Select onValueChange={v => update('department', v)} required>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Section</Label>
            <Select onValueChange={v => update('section', v)} required>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="regNo">Registration Number</Label>
          <Input id="regNo" placeholder="RA2211003010XXX" value={form.regNo} onChange={e => update('regNo', e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">College Email</Label>
          <Input id="email" type="email" placeholder="Enter mail id" value={form.email} onChange={e => update('email', e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" type="tel" placeholder="9876543210" value={form.phone} onChange={e => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••" value={form.password} onChange={e => update('password', e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm</Label>
            <Input id="confirmPassword" type="password" placeholder="••••••" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} required />
          </div>
        </div>
        <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold mt-2">
          Create Account
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already registered? <Link to="/student/login" className="text-primary font-semibold hover:underline">Sign In</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default StudentRegister;
