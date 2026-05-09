'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { X } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const success = login(
      email,
      password
    );

    if (!success) {
      setError(
        'Invalid email or password'
      );
      return;
    }

    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amethyst via-plum to-magenta relative overflow-hidden p-6">
      <button
      onClick={() => router.push('/')}
      className="absolute top-6 right-6 z-20 bg-white/10 border border-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition">
        <X className="w-5 h-5 text-white" />
        </button>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-bronze rounded-full blur-[120px]" />
        </div>
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8 rounded-2xl w-full max-w-md space-y-4"
      >
        <h1 className="text-3xl font-bold text-white text-center">
          Login
        </h1>

        <input
          placeholder="Email"
          type="email"
          className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-bronze transition"
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          placeholder="Password"
          type="password"
          className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-bronze transition"
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {error && (
          <p className="text-red-400 text-sm">
            {error}
          </p>
        )}

        <button className="w-full bg-bronze py-3 rounded-lg text-white font-semibold">
          Login
        </button>

        <p className="text-center text-white/70">
          Don’t have an account?
          <span
            className="text-bronze cursor-pointer ml-1"
            onClick={() =>
              router.push(
                '/auth/register'
              )
            }
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}