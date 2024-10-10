"use client";
import { title } from "@/components/primitives";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/client";

export default async function DocsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  // const { data: userInfo, error: profileFetchError } = await supabase
  //   .from("profile")
  //   .select("*")
  //   .eq("id", user?.id)
  //   .single();

  // if (profileFetchError) {
  //   console.error("Error fetching user profile:", profileFetchError);
  //   throw new Error("Error fetching user profile");
  // }

  // //check if full_name and username are NULL if they are NULL redirect to onboarding page
  // if (!userInfo?.full_name || !userInfo?.username) {
  //   revalidatePath("/", "layout");
  //   redirect("/onboarding");
  // }

  return (
    <div>
      <h1 className={title()}>Whu is this torubliung me like this</h1>
    </div>
  );
}
