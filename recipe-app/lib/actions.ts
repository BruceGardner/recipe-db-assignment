'use server';

import { revalidatePath } from 'next/cache';
import { redirect }       from 'next/navigation';
import bcrypt             from 'bcryptjs';
import { signIn, signOut } from './auth';
import {
  createUser,
  getUserByEmail,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  initDB,
} from './db';
import { auth } from './auth';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Pull the numeric user id from the current session, or throw. */
async function requireUserId(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');
  return Number(session.user.id);
}

/** Shared shape for action return values so the UI can show errors. */
export type ActionResult = { error?: string };

// ─── Auth Actions ─────────────────────────────────────────────────────────────

export async function registerAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  // Ensure tables exist on first use
  await initDB();

  const name     = (formData.get('name')     as string)?.trim();
  const email    = (formData.get('email')    as string)?.trim().toLowerCase();
  const password = (formData.get('password') as string);

  // ── Validation ──
  if (!name || !email || !password) {
    return { error: 'All fields are required.' };
  }
  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' };
  }

  try {
    const existing = await getUserByEmail(email);
    if (existing) return { error: 'An account with that email already exists.' };

    const hashed = await bcrypt.hash(password, 12);
    await createUser(name, email, hashed);
  } catch (err) {
    console.error('[registerAction]', err);
    return { error: 'Something went wrong. Please try again.' };
  }

  // Redirect to login after successful registration
  redirect('/login?registered=true');
}

export async function loginAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email    = (formData.get('email')    as string)?.trim().toLowerCase();
  const password = (formData.get('password') as string);

  if (!email || !password) return { error: 'All fields are required.' };

  try {
    await signIn('credentials', { email, password, redirect: false });
  } catch (err: any) {
    // NextAuth throws a specific error type on bad credentials
    if (
      err?.type === 'CredentialsSignin' ||
      err?.message?.includes('CredentialsSignin')
    ) {
      return { error: 'Invalid email or password.' };
    }
    console.error('[loginAction]', err);
    return { error: 'Something went wrong. Please try again.' };
  }

  redirect('/dashboard');
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: '/login' });
}

// ─── Recipe Actions ───────────────────────────────────────────────────────────

function parseList(raw: string): string[] {
  return raw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createRecipeAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  let userId: number;
  try {
    userId = await requireUserId();
  } catch {
    return { error: 'You must be logged in.' };
  }

  const name        = (formData.get('name')        as string)?.trim();
  const imageUrl    = (formData.get('imageUrl')    as string)?.trim();
  const ingredients = parseList(formData.get('ingredients') as string ?? '');
  const steps       = parseList(formData.get('steps')       as string ?? '');

  if (!name)               return { error: 'Recipe name is required.' };
  if (!ingredients.length) return { error: 'Add at least one ingredient.' };
  if (!steps.length)       return { error: 'Add at least one step.' };

  try {
    const recipe = await createRecipe(userId, name, imageUrl, ingredients, steps);
    revalidatePath('/dashboard');
    redirect(`/recipes/${recipe.id}`);
  } catch (err: any) {
    // redirect() throws internally — let it propagate
    if (err?.message === 'NEXT_REDIRECT') throw err;
    console.error('[createRecipeAction]', err);
    return { error: 'Could not save recipe. Please try again.' };
  }

  // Unreachable, but satisfies TS
  return {};
}

export async function updateRecipeAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  let userId: number;
  try {
    userId = await requireUserId();
  } catch {
    return { error: 'You must be logged in.' };
  }

  const id          = Number(formData.get('id'));
  const name        = (formData.get('name')        as string)?.trim();
  const imageUrl    = (formData.get('imageUrl')    as string)?.trim();
  const ingredients = parseList(formData.get('ingredients') as string ?? '');
  const steps       = parseList(formData.get('steps')       as string ?? '');

  if (!id)                 return { error: 'Recipe ID is missing.' };
  if (!name)               return { error: 'Recipe name is required.' };
  if (!ingredients.length) return { error: 'Add at least one ingredient.' };
  if (!steps.length)       return { error: 'Add at least one step.' };

  try {
    const updated = await updateRecipe(id, userId, name, imageUrl, ingredients, steps);
    if (!updated) return { error: 'Recipe not found or you do not have permission.' };

    revalidatePath('/dashboard');
    revalidatePath(`/recipes/${id}`);
    redirect(`/recipes/${id}`);
  } catch (err: any) {
    if (err?.message === 'NEXT_REDIRECT') throw err;
    console.error('[updateRecipeAction]', err);
    return { error: 'Could not update recipe. Please try again.' };
  }

  return {};
}

export async function deleteRecipeAction(
  id: number
): Promise<ActionResult> {
  let userId: number;
  try {
    userId = await requireUserId();
  } catch {
    return { error: 'You must be logged in.' };
  }

  try {
    const deleted = await deleteRecipe(id, userId);
    if (!deleted) return { error: 'Recipe not found or you do not have permission.' };

    revalidatePath('/dashboard');
    redirect('/dashboard');
  } catch (err: any) {
    if (err?.message === 'NEXT_REDIRECT') throw err;
    console.error('[deleteRecipeAction]', err);
    return { error: 'Could not delete recipe. Please try again.' };
  }

  return {};
}