import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api, { errorMessage } from '../../lib/api';
import { ChatState } from '../../context/ChatProvider';
import { useToast } from '../ui/Toast';
import Input from '../ui/Input';
import Button from '../ui/Button';

const LoginForm = () => {
  const { setUser } = ChatState();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: 'Fill in both fields', status: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/user/login', { email, password });
      toast({ title: 'Welcome back', status: 'success' });
      setUser(data);
      navigate('/chats');
    } catch (error) {
      toast({ title: 'Could not log in', description: errorMessage(error), status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = () => {
    setEmail('guest@example.com');
    setPassword('123456');
  };

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-4">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        autoComplete="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="relative">
        <Input
          label="Password"
          type={show ? 'text' : 'password'}
          placeholder="Enter your password"
          value={password}
          autoComplete="current-password"
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

      <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
        Log in
      </Button>
      <Button type="button" variant="outline" size="lg" onClick={loginAsGuest} className="w-full">
        Use guest demo account
      </Button>
    </form>
  );
};

export default LoginForm;
