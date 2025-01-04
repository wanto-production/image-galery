import { createBrowserClient } from "@supabase/ssr"
import { PUBLIC_SUPABASE_ANON_KEY,PUBLIC_SUPABASE_URL } from "$env/static/public"

export const load = async ({ fetch }) => {
    const supabase = createBrowserClient(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_ANON_KEY,
        {
            global:{
                fetch
            }
        }
    )

    const { data } = await supabase.auth.getUser()

    return{ supabase,user:data.user }
}