'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthRepository } from '../../../modules/auth/auth.repository';
import { createClient } from '../../lib/supabase/client';
import { ArrowLeft } from 'lucide-react';

const supabase = createClient();
const authRepo = new AuthRepository(supabase);

export default function RegisterPage() {
  const usernameRegex = /^[a-z0-9_]{3,20}$/;
  const displayNameRegex = /^[a-zA-Z0-9 ]{2,30}$/;
  const passwordRegex = /^.{6,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    if (!usernameRegex.test(username)) {
      setError('Username must be 3–20 characters and contain only lowercase letters, numbers, or underscores');
      setIsLoading(false);
      return;
    }

    if (!displayNameRegex.test(displayName)) {
      setError('Display name must be 2 - 30 characters and contain only letters, numbers, and spaces');
      setIsLoading(false);
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (!passwordRegex.test(password)) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          username,
          display_name: displayName,
          avatar_url: null, 
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error('Registration failed');
      }
  
      console.log('REGISTER SUCCESS:', data);
  
      router.push('/');
      router.refresh();
  
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
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
        <h1 className="text-3xl font-bold text-white text-center">Create Account</h1>
        <p className="text-center text-white/60 mb-4">Join the BasketBoxd community</p>

                {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        <label className="block text-sm text-white/70 mb-1">
          Username
        </label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
          className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-bronze transition"
          required
        />

        <label className="block text-sm text-white/70 mb-1">
          Display Name
        </label>
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-bronze transition"
          required
        />

        <label className="block text-sm text-white/70 mb-1">
          Email Address
        </label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-bronze transition"
          required
        />

        <label className="block text-sm text-white/70 mb-1">
          Password
        </label>
        <input
          type="password"
          placeholder="Password (min. 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-bronze transition"
          required
        />

        <label className="block text-sm text-white/70 mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-bronze transition"
          required
        />
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-bronze py-3 rounded-lg text-white font-semibold hover:bg-opacity-80 transition disabled:opacity-50"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="text-center text-white/70">
          Already have an account?
          <span
            className="text-bronze cursor-pointer ml-1 hover:underline"
            onClick={() => router.push('/auth/login')}
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
}