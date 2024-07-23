export async function POST({ request }) {
  const { address } = await request.json();

  // Check if user exists
  let { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', address)
    .single();

  if (error && error.code !== 'PGRST116') {
    return json({ error: 'Failed to check user existence' }, { status: 500 });
  }

  if (!user) {
    // Create new user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({ wallet_address: address })
      .single();

    if (createError) {
      return json({ error: 'Failed to create user' }, { status: 500 });
    }

    user = newUser;
  }

  // Here you would typically create a session or JWT for the user

  return json({ user });
}
