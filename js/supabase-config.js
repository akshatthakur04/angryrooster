// supabase-config.js - TEMPLATE FILE

// INSTRUCTIONS:
// 1. Create a copy of this file and name it 'supabase-config.local.js'.
// 2. In that new file, replace the placeholder values below with your actual Supabase URL and Key.
//
// IMPORTANT: The 'supabase-config.local.js' file is ignored by Git to keep your keys private.

const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE'; 
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';

// The 'supabase' object is globally available from the CDN script.
// We create our own client instance from it.
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); 