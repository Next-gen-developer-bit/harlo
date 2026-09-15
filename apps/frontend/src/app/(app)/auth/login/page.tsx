import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AuthLogin({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params || {})) {
    if (typeof value === 'string' && value) {
      query.set(key, value);
    }
  }
  const suffix = query.toString();
  redirect(suffix ? `/login?${suffix}` : '/login');
}
