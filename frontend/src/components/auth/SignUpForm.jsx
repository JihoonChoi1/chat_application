import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api, { errorMessage } from '../../lib/api';
import { ChatState } from '../../context/ChatProvider';
import { useToast } from '../ui/Toast';
import Input from '../ui/Input';
import Button from '../ui/Button';

const SignUpForm = () => {
  const { setUser } = ChatState();
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast({ title: 'Fill in every field', status: 'warning' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'Passwords do not match', status: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/user', { name, email, password });
      toast({ title: 'Account created', status: 'success' });
      setUser(data);
      navigate('/chats');
    } catch (error) {
      toast({ title: 'Could not sign up', description: errorMessage(error), status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-4">
      <Input label="Name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="relative">
        <Input
          label="Password"
          type={show ? 'text' : 'password'}
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 bottom-2.5 text-text-muted hover:text-text"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <Input
        label="Confirm password"
        type={show ? 'text' : 'password'}
        placeholder="Type it again"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
        Create account
      </Button>
    </form>
  );
};

export default SignUpForm;
