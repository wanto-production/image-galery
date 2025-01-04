// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Session, SupabaseClient, User } from "@supabase/supabase-js";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user:User|null,
			supabase:SupabaseClient,
			session:Session|null,
			safeGetSession:()=> Promise<{session:Session|null,user:User|null}>
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
