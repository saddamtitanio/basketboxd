'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthRepository } from '../../../modules/auth/auth.repository';
import { createClient } from '../../lib/supabase/client';
import { ArrowLeft } from 'lucide-react';

const supabase = createClient();
const authRepo = new AuthRepository(supabase);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/');
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error } = await authRepo.login(email, password);
      
      if (error) {
        throw new Error(error.message);
      }
      
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError('Invalid email or password');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amethyst via-plum to-magenta relative overflow-hidden p-6">
      <button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 z-20 bg-white/10 border border-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-bronze rounded-full blur-[120px]" />
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8 rounded-2xl w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold text-white text-center">Welcome Back</h1>
        <p className="text-center text-white/60 mb-4">Sign in to your account</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-bronze transition"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-bronze transition"
          required
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-bronze py-3 rounded-lg text-white font-semibold hover:bg-opacity-80 transition disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="text-center text-white/70">
          Don't have an account?
          <span
            className="text-bronze cursor-pointer ml-1 hover:underline"
            onClick={() => router.push('/auth/register')}
          >
            Create one
          </span>
        </p>
      </form>
    </div>
  );
}