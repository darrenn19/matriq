import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://urhnvtteqvwoidldxwfd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyaG52dHRlcXZ3b2lkbGR4d2ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0ODE0OTQsImV4cCI6MjA3ODA1NzQ5NH0.YKj08QtdttjuMMoXz-ulfnPFV-QJ86gHAtHMF-R3JV8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
