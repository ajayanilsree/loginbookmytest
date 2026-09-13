import { createClient } from '@supabase/supabase-js';

const MAX_NAME_LENGTH = 100;
const MAX_CODE_LENGTH = 500;

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    let payload;
    try {
      payload = typeof request.body === 'string' ? JSON.parse(request.body) : (request.body || {});
    } catch {
      return response.status(400).json({ success: false, error: 'Invalid submission.' });
    }
    const name = typeof payload?.name === 'string' ? payload.name.trim() : '';
    const code = typeof payload?.code === 'string' ? payload.code.trim() : '';

    if (!name || !code || name.length > MAX_NAME_LENGTH || code.length > MAX_CODE_LENGTH) {
      return response.status(400).json({ success: false, error: 'Invalid submission.' });
    }

    if (typeof payload?.website === 'string' && payload.website.trim()) {
      return response.status(201).json({ success: true });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { error } = await supabase.from('customer_details').insert({ name, code });
    if (error) {
      console.error('Customer details insert failed:', error.message);
      return response.status(500).json({ success: false, error: 'Unable to save details.' });
    }

    return response.status(201).json({ success: true });
  } catch (error) {
    console.error('Submission request failed:', error instanceof Error ? error.message : 'Unknown error');
    return response.status(500).json({ success: false, error: 'Unable to save details.' });
  }
}
