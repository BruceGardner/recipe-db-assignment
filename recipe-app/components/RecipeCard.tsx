import Link from 'next/link';
import Image from 'next/image';
import type { DBRecipe } from '@/lib/db';

export default function RecipeCard({ recipe }: { recipe: DBRecipe }) {
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="group bg-white rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
    >
      <div className="relative w-full h-48 bg-amber-100">
        {recipe.image_url ? (
          <Image
            src={recipe.image_url}
            alt={recipe.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            🍽️
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-lg font-bold text-amber-900 font-[family-name:var(--font-playfair)] group-hover:text-amber-600 transition-colors">
          {recipe.name}
        </h2>
        <p className="text-sm text-amber-600 mt-1">
          {recipe.ingredients.length} ingredient{recipe.ingredients.length !== 1 ? 's' : ''} · {recipe.steps.length} step{recipe.steps.length !== 1 ? 's' : ''}
        </p>
        <p className="text-xs text-amber-400 mt-auto pt-3">
          {new Date(recipe.created_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
          })}
        </p>
      </div>
    </Link>
  );
}