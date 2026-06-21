import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/lib/auth';
import { getRecipeById } from '@/lib/db';
import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';
import DeleteButton from '@/components/DeleteButton';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const session = await auth();
  const recipe  = await getRecipeById(Number(id), Number(session?.user.id));
  return { title: recipe?.name ?? 'Recipe' };
}

export default async function RecipeDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const recipe  = await getRecipeById(Number(id), Number(session!.user.id));

  if (!recipe) notFound();


  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href="/dashboard"
          className="text-sm text-amber-600 hover:text-amber-800 font-medium mb-6 inline-block"
        >
          ← Back to My Recipes
        </Link>

        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
          {recipe.image_url && (
            <div className="relative w-full h-64 sm:h-80">
              <Image
                src={recipe.image_url}
                alt={recipe.name}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="p-6 sm:p-10">
            <div className="flex items-start justify-between gap-4 mb-8">
              <h1 className="text-3xl font-bold text-amber-900 font-[family-name:var(--font-playfair)]">
                {recipe.name}
              </h1>
              <div className="flex gap-2 shrink-0">
                <Link
                  href={`/recipes/${recipe.id}/edit`}
                  className="text-sm bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium px-4 py-2 rounded-xl transition-colors"
                >
                  Edit
                </Link>
                <DeleteButton id={recipe.id} />
              </div>
            </div>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-amber-900 mb-4 font-[family-name:var(--font-playfair)]">
                Ingredients
              </h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={i} className="flex items-start gap-3 text-amber-800">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-900 mb-4 font-[family-name:var(--font-playfair)]">
                Steps
              </h2>
              <ol className="space-y-4">
                {recipe.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <p className="text-amber-800 pt-0.5">{step}</p>
                  </li>
                ))}
              </ol>
            </section>

            <p className="text-xs text-amber-400 mt-10">
              Added{' '}
              {new Date(recipe.created_at).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}