'use client';

import { useActionState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loginAction } from '@/lib/actions';

const initialState = { error: undefined };

function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get('registered');

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="text-4xl">🍳</Link>
        <h1 className="text-3xl font-bold text-amber-900 mt-2 font-[family-name:var(--font-playfair)]">
          Welcome back
        </h1>
        <p className="text-amber-700 mt-1">Sign in to your RecipeBox</p>
      </div>

      {justRegistered && (
        <div className="bg-green-100 border border-green-300 text-green-800 rounded-xl px-4 py-3 mb-4 text-sm">
          Account created! You can now sign in.
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8">
        <form action={formAction} className="space-y-5">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {state.error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-amber-50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-amber-50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            {pending ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-amber-700 mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold text-amber-600 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-amber-600">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}