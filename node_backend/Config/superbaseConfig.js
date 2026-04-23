const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Supabase URL or SERVICE_ROLE_KEY is not set. Image upload for diagnoses will fail until these are configured.'
  );
}

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  console.log('Supabase client created successfully'))
  : console.log('Supabase client creation failed. URL or SERVICE_ROLE_KEY is not set.');

module.exports = supabase;

