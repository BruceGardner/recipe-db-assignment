import Link from 'next/link';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await auth();
  if (session) redirect('/dashboard');

  return (
    <main className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <div className="text-6xl mb-4">🍳</div>
        <h1 className="text-5xl font-bold text-amber-900 mb-4 font-[family-name:var(--font-playfair)]">
          RecipeBox
        </h1>
        <p className="text-lg text-amber-700 mb-10">
          Your personal space to save, organize, and revisit your favorite recipes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="border-2 border-amber-600 text-amber-700 hover:bg-amber-100 font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}