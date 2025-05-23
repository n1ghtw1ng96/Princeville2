import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://efmckrsmwuebvyncfnzy.supabase.co'; // Your Supabase Project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmbWNrcnNtd3VlYnZ5bmNmbnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NTExNjUsImV4cCI6MjA2MzUyNzE2NX0.HnChP9qzpIqie1JB7OsSwPjclQujnVvEi14lBuAexOg'; // Your Supabase anon/public API key

export const supabase = createClient(supabaseUrl, supabaseKey);

