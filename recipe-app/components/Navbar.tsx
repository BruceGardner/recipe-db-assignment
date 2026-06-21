import Link from 'next/link';
import { auth } from '@/lib/auth';
import { logoutAction } from '@/lib/actions';

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="bg-white border-b border-amber-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-amber-900 font-bold text-xl font-[family-name:var(--font-playfair)]"
        >
          🍳 RecipeBox
        </Link>

        <div className="flex items-center gap-4">
          {session?.user && (
            <span className="text-sm text-amber-700 hidden sm:block">
              Hi, {session.user.name}!
            </span>
          )}

          <Link
            href="/recipes/new"
            className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            + New Recipe
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-amber-700 hover:text-amber-900 font-medium transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}