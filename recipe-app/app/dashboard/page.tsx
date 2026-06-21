import { auth } from '@/lib/auth';
import { getRecipesByUser } from '@/lib/db';
import Navbar from '@/components/Navbar';
import RecipeCard from '@/components/RecipeCard';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Recipes' };

export default async function DashboardPage() {
  const session = await auth();
  const userId  = Number(session!.user.id);
  const recipes = await getRecipesByUser(userId);

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-amber-900 font-[family-name:var(--font-playfair)]">
            My Recipes
          </h1>
          <span className="text-sm text-amber-600">
            {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
          </span>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-xl font-semibold text-amber-800 mb-2">
              No recipes yet
            </h2>
            <p className="text-amber-600 mb-6">
              Start building your collection!
            </p>
            <Link
              href="/recipes/new"
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Create your first recipe
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}