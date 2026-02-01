import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uqogpcjwxssniubqfout.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxb2dwY2p3eHNzbml1YnFmb3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NjA3NjMsImV4cCI6MjA4MjEzNjc2M30.6xPnh9leehnh1PteHve4ud857am_0q0vPjSr97aSvaI';

export const supabase = createClient(supabaseUrl, supabaseKey);
