import { createClient } from '@supabase/supabase-js'
import { getAccessToken } from '@auth0/nextjs-auth0'

export const getSupabaseServerClient = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  try {
    // Attempt to get the Auth0 access token for the logged-in user
    const { accessToken } = await getAccessToken()
    
    // Create a Supabase client that uses the Auth0 token
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    })
  } catch (error) {
    // If no user is logged in, fallback to the standard anonymous client
    return createClient(supabaseUrl, supabaseAnonKey)
  }
}
