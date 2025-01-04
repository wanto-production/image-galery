import type { EmailOtpType } from "@supabase/supabase-js";
import type { RequestHandler } from "./$types";
import { redirect } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";

export const GET = (async({ locals,url })=>{
    const { token_hash,type } = Object.fromEntries(url.searchParams) as {
        token_hash:string,
        type:EmailOtpType
    }
    
    const { error:authErr } = await locals.supabase.auth.verifyOtp({
        token_hash,
        type
    })

    if(authErr)error(authErr.status as number,{
        message:authErr.message
    })
    
    return redirect(308,'/')
})satisfies RequestHandler