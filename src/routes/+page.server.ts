import type { Actions, PageServerLoad } from "./$types"
import { PUBLIC_BUCKET_URL } from "$env/static/public"

export const load = (async({ locals })=>{

    if(locals.user){
        const user = locals.user

        const { data:images } = await locals.supabase
        .from("images_table")
        .select("*")
        .eq("user_id",user?.id)
    
        return{ images }
    }

})satisfies PageServerLoad

export const actions = ({
    async login({ request,locals }){
        const email = (await request.formData()).get("email") as string

        const {error} = await locals.supabase.auth.signInWithOtp({
            email
        })

        if(error) return { message:error.message,status:"error" };

        return{ message:"login completed,then wait the email verification!",status:"ok" };
    },
    async store({ request,locals }){
        const image = (await request.formData()).get("file") as File

        if (!["png","jpg","avif","webp"].includes(image.type.replaceAll("image/",""))){
            
            
            return{ message:'oops wrong file type'}
        }
        
        const {error:bucketErr} = await locals
        .supabase
        .storage
        .from("images")
        .upload(image.name,image,{
            contentType:image.type,
            upsert:true
        })

        if(bucketErr)return{ message:bucketErr.message,status:"error" };

        const {error:databaseErr} = await locals.supabase
        .from("images_table")
        .insert([
            {
                user_id:locals.user?.id,
                path:`${PUBLIC_BUCKET_URL}${image.name}`,
                image_name:image.name
            },
        ])

        if(databaseErr)return{ message:databaseErr.message,status:"error" };

        return{ message:`store image ${image.name} complete!`,status:"ok" };
    },
    async delete({ request,locals }){
        const path = (await request.formData()).get("path") as string

        const { error:bucketErr } = await locals.supabase.storage
        .from("images")
        .remove([path.replaceAll(PUBLIC_BUCKET_URL,"")])

        if(bucketErr)return{ message:bucketErr.message,status:"error" };

        const {error:databaseErr} = await locals.supabase
        .from("images_table")
        .delete()
        .eq("path",path)

        if(databaseErr)return { message:databaseErr,status:"error" };

        return{message:`delete image ${path.replaceAll(PUBLIC_BUCKET_URL,"")} complete!`,status:"ok" }
    },
    async logout({ locals }){
        await locals.supabase.auth.signOut()
    }
})satisfies Actions