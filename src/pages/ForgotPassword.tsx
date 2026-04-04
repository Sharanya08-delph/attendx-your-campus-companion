import { useState } from 'react';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast.success('Password reset link sent to your email!');
  };

  return (
    <AuthLayout title="Forgot Password" subtitle="We'll send you a reset link">
      {sent ? (
        <div className="text-center py-6 space-y-4">
          <CheckCircle className="w-16 h-16 text-success mx-auto" />
          <h3 className="text-lg font-display font-bold text-card-foreground">Check Your Email</h3>
          <p className="text-sm text-muted-foreground">We've sent a password reset link to <strong>{email}</strong></p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="Enter mail id" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold">Send Reset Link</Button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
