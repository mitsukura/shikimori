import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/authUtils';

export async function GET(_request: Request) {
  if (!(await isAdmin())) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const mappedData = data.map((u) => ({
      ...u,
      firstName: u.first_name,
      lastName: u.last_name,
      isAdmin: u.is_admin,
    }));
    return NextResponse.json(mappedData);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '予期せぬエラーが発生しました';
    return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
