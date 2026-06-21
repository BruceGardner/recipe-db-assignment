'use client';

import { useActionState } from 'react';
import type { ActionResult } from '@/lib/actions';
import type { DBRecipe } from '@/lib/db';

type Props = {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  recipe?: DBRecipe; // populated when editing
};

const initialState: ActionResult = {};

export default function RecipeForm({ action, recipe }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);

  // Convert arrays back to newline-separated strings for the textarea
  const defaultIngredients = recipe?.ingredients.join('\n') ?? '';
  const defaultSteps       = recipe?.steps.join('\n')       ?? '';

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden id field for edits */}
      {recipe && <input type="hidden" name="id" value={recipe.id} />}

      {/* Error banner */}
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {state.error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-amber-900 mb-1">
          Recipe Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="name"
          required
          defaultValue={recipe?.name ?? ''}
          className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-amber-50"
          placeholder="e.g. Tester Dish"
        />
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium text-amber-900 mb-1">
          Image URL <span className="text-amber-400 text-xs">(optional)</span>
        </label>
        <input
          type="url"
          name="imageUrl"
          defaultValue={recipe?.image_url ?? ''}
          className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-amber-50"
          placeholder="https://example.com/photo.jpg"
        />
        <p className="text-xs text-amber-500 mt-1">
          Paste a direct link to an image of your dish.
        </p>
      </div>

      {/* Ingredients */}
      <div>
        <label className="block text-sm font-medium text-amber-900 mb-1">
          Ingredients <span className="text-red-400">*</span>
        </label>
        <textarea
          name="ingredients"
          required
          rows={6}
          defaultValue={defaultIngredients}
          className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-amber-50 resize-y"
          placeholder={"thousand lines of code\n1 tsp blood, sweat, and tears\n3 bugs"}
        />
        <p className="text-xs text-amber-500 mt-1">One ingredient per line.</p>
      </div>

      {/* Steps */}
      <div>
        <label className="block text-sm font-medium text-amber-900 mb-1">
          Steps <span className="text-red-400">*</span>
        </label>
        <textarea
          name="steps"
          required
          rows={8}
          defaultValue={defaultSteps}
          className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-amber-50 resize-y"
          placeholder={"Preheat oven to 375°F.\nMix code and bugs.\nAdd blood, sweat, and tears and stir until combined and it works."}
        />
        <p className="text-xs text-amber-500 mt-1">One step per line.</p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {pending
          ? recipe ? 'Saving changes…' : 'Creating recipe…'
          : recipe ? 'Save Changes'   : 'Create Recipe'}
      </button>
    </form>
  );
}