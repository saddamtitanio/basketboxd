'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { X } from 'lucide-react';

export default function Register() {
  const router = useRouter();

  const { register } = useAuth();

  const [form, setForm] =
    useState({
      username: '',
      name: '',
      email: '',
      password: '',
    });

  const [error, setError] =
    useState('');

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const result = register({
      ...form,
      bio: '',
      image: '',
    });

    if (result) {
      setError(result);
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
          Register
        </h1>

        <input
          placeholder="Unique Username"
          className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-bronze transition"
          onChange={(e) =>
            setForm({
              ...form,
              username:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Display Name"
          className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-bronze transition"
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          placeholder="Email"
          type="email"
          className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-bronze transition"
          onChange={(e) =>
            setForm({
              ...form,
              email:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Password"
          type="password"
          className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-bronze transition"
          onChange={(e) =>
            setForm({
              ...form,
              password:
                e.target.value,
            })
          }
        />

        {error && (
          <p className="text-red-400 text-sm">
            {error}
          </p>
        )}

        <button className="w-full bg-bronze py-3 rounded-lg text-white font-semibold">
          Create Account
        </button>

        <p className="text-center text-white/70">
          Already have an account?
          <span
            className="text-bronze cursor-pointer ml-1"
            onClick={() =>
              router.push(
                '/auth/login'
              )
            }
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}