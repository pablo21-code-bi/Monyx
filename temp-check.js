// temp-check.js
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://aspdyfucuhggpukyuraq.supabase.co';
const supabaseKey = 'sb_publishable_OGyPfmWf_Jz07p7p8YBHgg_SKwE9H1F';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log("Checking auth users...");
  // Let's create a dummy signup to bypass IP rate limit? I can't from node without email if email is required, but let's try.
  const { data: auth, error: authErr } = await supabase.auth.signUp({
    email: 'test_server@test.com',
    password: 'password123'
  });
  console.log("Auth:", authErr ? authErr : auth);

  if (auth?.user) {
    console.log("Inserting user into public.users...");
    const { data: dbData, error: dbErr } = await supabase.from('users').insert([
      { cpf: '12345678901', name: 'Server Test', email: 'test_server@test.com', auth_id: auth.user.id }
    ]).select();
    console.log("DB Insert:", dbErr ? dbErr : dbData);
  }
}

testInsert();
