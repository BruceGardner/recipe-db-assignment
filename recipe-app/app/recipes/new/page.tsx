import Navbar from '@/components/Navbar';
import RecipeForm from '@/components/RecipeForm';
import { createRecipeAction } from '@/lib/actions';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'New Recipe' };

export default function NewRecipePage() {
  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-10">
        <Link
          href="/dashboard"
          className="text-sm text-amber-600 hover:text-amber-800 font-medium mb-6 inline-block"
        >
          ← Back to My Recipes
        </Link>

        <h1 className="text-3xl font-bold text-amber-900 mb-8 font-[family-name:var(--font-playfair)]">
          New Recipe
        </h1>

        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-8">
          <RecipeForm action={createRecipeAction} />
        </div>
      </main>
    </div>
  );
}