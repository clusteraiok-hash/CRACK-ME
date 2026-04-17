import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xghqwjfbzasmwnmeexcj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnaHF3amZiemFzbXdubWVleGNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNTQwNjksImV4cCI6MjA5MTkzMDA2OX0.zGaaC-0O-WEg372xezTEjL5v_HzPv9kAwCn5V_0LYUk';

export const supabase = createClient(supabaseUrl, supabaseKey);
