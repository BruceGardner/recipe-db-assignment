import { notFound } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getRecipeById } from '@/lib/db';
import { updateRecipeAction } from '@/lib/actions';
import Navbar from '@/components/Navbar';
import RecipeForm from '@/components/RecipeForm';
import type { Metadata } from 'next';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const session = await auth();
  const recipe  = await getRecipeById(Number(id), Number(session?.user.id));
  return { title: recipe ? `Edit ${recipe.name}` : 'Edit Recipe' };
}

export default async function EditRecipePage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const recipe  = await getRecipeById(Number(id), Number(session!.user.id));

  if (!recipe) notFound();

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-10">
        <Link
          href={`/recipes/${recipe.id}`}
          className="text-sm text-amber-600 hover:text-amber-800 font-medium mb-6 inline-block"
        >
          ← Back to Recipe
        </Link>

        <h1 className="text-3xl font-bold text-amber-900 mb-8 font-[family-name:var(--font-playfair)]">
          Edit Recipe
        </h1>

        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-8">
          <RecipeForm action={updateRecipeAction} recipe={recipe} />
        </div>
      </main>
    </div>
  );
}