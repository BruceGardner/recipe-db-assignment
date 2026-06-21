'use client';

import { deleteRecipeAction } from '@/lib/actions';

export default function DeleteButton({ id }: { id: number }) {
  const handleDelete = async () => {
    if (!confirm('Delete this recipe? This cannot be undone.')) return;
    await deleteRecipeAction(id);
  };

  return (
    <button
      onClick={handleDelete}
      className="text-sm bg-red-50 hover:bg-red-100 text-red-700 font-medium px-4 py-2 rounded-xl transition-colors"
    >
      Delete
    </button>
  );
}