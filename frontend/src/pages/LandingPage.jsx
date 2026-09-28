import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginForm from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignUpForm';
import { ChatState } from '../context/ChatProvider';
import { cn } from '../lib/cn';

const LandingPage = () => {
  const { user } = ChatState();
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');

  useEffect(() => {
    if (user) navigate('/chats', { replace: true });
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-paper md:flex-row">
      <div className="relative flex w-full flex-col justify-center overflow-hidden bg-ink px-8 py-16 text-text-on-ink md:w-2/5 md:px-14 md:py-0">
        <p className="mb-6 text-sm text-text-on-ink-muted">Talkative</p>
        <h1 className="font-display text-5xl italic leading-[1.05] md:text-6xl">
          Real conversations,
          <br />
          in real time.
        </h1>
        <p className="mt-6 max-w-sm text-text-on-ink-muted">
          One-on-one chats and group threads with live typing and instant delivery — no
          refresh required.
        </p>
        <div className="mt-10 flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-4 py-3 w-fit">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full bg-ember"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
          <span className="ml-2 text-xs text-text-on-ink-muted">someone is typing</span>
        </div>
      </div>

      <div className="flex w-full flex-1 items-center justify-center px-6 py-12 md:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex rounded-full border border-ink p-1">
            {[
              { id: 'login', label: 'Log in' },
              { id: 'signup', label: 'Sign up' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex-1 rounded-full py-2 text-sm font-medium transition-colors',
                  tab === t.id ? 'bg-ink text-paper' : 'text-text-muted hover:text-text'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          {tab === 'login' ? <LoginForm /> : <SignUpForm />}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
