"use client";

import React, { useState } from "react";
import { Button, Input, Image, Textarea } from "@nextui-org/react";

interface OnboardingFormProps {
  createProfile: (formData: FormData) => Promise<void>;
}

export default function OnboardingForm({ createProfile }: OnboardingFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      await createProfile(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error, maybe set an error state to display to the user
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form action={handleSubmit}>
      <div>
        <Image
          alt="Logo"
          className="mx-auto lg:hidden"
          height={80}
          src="/placeholder.svg?height=80&width=80"
          width={80}
        />
      </div>
      <div className="mt-8 space-y-6">
        <Input
          isRequired
          className="text-white"
          label="Full Name"
          name="fullName"
          placeholder="Enter your full name"
          variant="bordered"
        />
        <Textarea
          className="text-white"
          label="Bio"
          name="bio"
          placeholder="Tell us about yourself"
          variant="bordered"
        />
        <Input
          className="text-white"
          label="Avatar URL (Optional)"
          name="avatarUrl"
          placeholder="Enter your avatar URL"
          variant="bordered"
        />
        <Button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating Profile..." : "Complete Profile"}
        </Button>
      </div>
    </form>
  );
}
