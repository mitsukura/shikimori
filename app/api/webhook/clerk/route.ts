import { Webhook } from 'svix';
import { headers } from 'next/headers';
import type { WebhookEvent } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Webhookシークレットの検証
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env.local');
  }

  // リクエストヘッダーの取得
  const headersList = req.headers;
  const svix_id = headersList.get('svix-id');
  const svix_timestamp = headersList.get('svix-timestamp');
  const svix_signature = headersList.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 });
  }

  // リクエストボディの取得
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Webhookの検証
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }

  // イベントタイプに基づいた処理
  const eventType = evt.type;
  console.log(`Webhook event type: ${eventType}`);

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, phone_numbers } = evt.data;
    const email = email_addresses[0]?.email_address;
    const phone = phone_numbers[0]?.phone_number;

    if (!email) {
      return new Response('Error: No email found', { status: 400 });
    }

    try {
      // Supabaseにユーザーを作成/更新
      const { error } = await supabase
        .from('users')
        .upsert({
          clerk_id: id,
          email,
          first_name: first_name || '',
          last_name: last_name || '',
          phone: phone || '',
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'clerk_id'
        });

      if (error) {
        console.error('Error upserting user:', error);
        return new Response(`Error upserting user: ${error.message}`, { status: 500 });
      }

      return NextResponse.json({ success: true, event: eventType });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return new Response(`Error processing webhook: ${error}`, { status: 500 });
    }
  } else if (eventType === 'user.deleted') {
    const { id } = evt.data;

    try {
      // Supabaseからユーザーを削除
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('clerk_id', id);

      if (error) {
        console.error('Error deleting user:', error);
        return new Response(`Error deleting user: ${error.message}`, { status: 500 });
      }

      return NextResponse.json({ success: true, event: eventType });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return new Response(`Error processing webhook: ${error}`, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, message: 'Webhook received' });
}