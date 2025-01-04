<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import * as Card from "$lib/components/ui/card";
	import { enhance } from "$app/forms";
	import { onMount } from "svelte";
    import { acts } from "@tadashi/svelte-notification"

    let { data,form } = $props()

    let pending = $state(false)

    const downloadImages =async(name:string)=>{
        const { data:{publicUrl} } = data.supabase.storage
        .from("images")
        .getPublicUrl(name)

        await fetch(publicUrl)
        .then(res=>res.blob())
        .then(blob=>{
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a');
            link.href = url;
            link.download = name; // Nama file yang akan diunduh
    
            // Tambahkan elemen ke DOM
            document.body.appendChild(link);
    
            // Klik elemen untuk memulai unduhan
            link.click();
    
            // Hapus elemen dari DOM setelah unduhan selesai
            document.body.removeChild(link);
            URL.revokeObjectURL(url)
        })

    }

    $effect(()=>{
        if (form?.status == "ok") {
            acts.add({ mode:"success",message:form.message })
        }
        if (form?.status != "ok" && form?.message) {
            acts.add({ mode:"danger",message:form?.message})
        }
    })
</script>

<svelte:head>
    <title>home</title>
</svelte:head>

<main class=" w-full h-screen flex flex-col justify-center items-center gap-3 relative p-2">
    {#if !data.user}
        <form method="POST" action="?/login" class=" flex gap-2 items-center group" use:enhance={()=>{
            pending = true
            return async({update})=>{
                await update()
                pending = false
            }
        }}>
            <Input class=" bg-white" type="email" name="email" placeholder="email" required/>
            <Button type="submit" disabled={pending}>login</Button>
        </form>
    {:else}
        <form method="POST" action="?/store" enctype="multipart/form-data" class=" flex items-center gap-2" use:enhance={()=>{
            pending = true
            return async({update})=>{
                await update()
                pending = false
            }
        }}>
            <Input type="file" name="file" accept="image/*" required/>
            <Button type="submit" disabled={pending}>upload</Button>
        </form>
    {/if}
    <Card.Root class=" w-[300px] h-[400px] ">
        <Card.Header>
            <Card.Title>image container</Card.Title>
        </Card.Header>
        <Card.Content class="overflow-x-hidden overflow-y-auto h-[340px] border-t-2 border-gray-400 mt-2 scrollbar-thin scrollbar-thumb-[#0c0c0c] scrollbar-track-gray-100">
            <div class=" w-full h-fit flex flex-wrap gap-2 justify-center items-center">
                {#if !data.user}
                    <h2>you need to login if want store image</h2>
                {:else if data.images}
                    {#each data.images as image}
                        <Card.Root>
                            <Card.Header>
                                <Card.Title>{image.image_name}</Card.Title>
                            </Card.Header>
                            <Card.Content> 
                                <img class=" h-auto w-auto" loading="lazy" src={image.path} alt={image.image_name}/>
                            </Card.Content>
                            <Card.Footer class=" gap-2">
                                <form action="?/delete" method="post" use:enhance>
                                    <input type="hidden" value={image.path} name="path">
                                    <button class="text-red-500">delete <i class="fa fa-trash"></i></button>
                                </form>
                                <button onclick={()=> downloadImages(image.image_name)} class="text-green-500">download <i class="fa fa-circle-arrow-down"></i></button>
                            </Card.Footer>
                        </Card.Root>
                    {/each}
                {/if}
            </div>
        </Card.Content>
    </Card.Root>
</main>