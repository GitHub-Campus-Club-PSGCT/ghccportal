import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Logo } from "@/components/icons";
import { DBFunctions } from "@/functions/DBFunctions";
import OnboardingForm from "@/components/OnBoardingForm";

export async function OnboardingPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const db = new DBFunctions();

  async function createProfile(formData: FormData) {
    "use server";

    const fullName = formData.get("fullName") as string;
    const bio = formData.get("bio") as string;
    const avatarUrl = formData.get("avatarUrl") as string;

    try {
      const result = await db.createProfile(
        user?.id as string,
        fullName,
        bio,
        avatarUrl
      );

      if (result) {
        redirect("/dashboard");
      } else {
        throw new Error("Failed to create profile");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      // You might want to return an error message here to display to the user
    }
  }

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-black via-gray-900 via-violet-950 via-violet-800 to-indigo-600">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <div className="relative z-10 w-full max-w-md p-6">
          <Logo height={100} width={200} />
          <div className="mt-16 space-y-3 flex flex-col text-left">
            <h3 className="text-white text-3xl font-bold">
              Welcome to &nbsp;
              <span className="font-light text-4xl">
                GitHub Campus Club PSGCT
              </span>
            </h3>
            <p className="text-gray-300">
              Complete your profile to get started with your member account.
            </p>
            <p className="text-sm text-gray-400 font-medium">
              We&apos;re excited to have you on board!
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 bg-white/20 bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-2xl">
          <OnboardingForm createProfile={createProfile} />
        </div>
      </div>
    </div>
  );
}
