"use client";

import React from "react";
import { User } from "@clerk/nextjs/server";
import { Avatar, Divider } from "@nextui-org/react";

interface Profile {
  avatar_url: string | null;
  bio: string | null;
  full_name: string;
  id: string;
  role: string;
  user_id: string;
}

interface AccountDetailsProps {
  profile: Profile;
  user: User;
}

export default function AccountDetails({ profile, user }: AccountDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar
          name={profile.full_name}
          size="lg"
          src={profile.avatar_url || user.imageUrl}
        />
        <div>
          <h3 className="text-2xl font-semibold text-white">
            {profile.full_name}
          </h3>
          <p className="text-gray-300">{user.emailAddresses[0].emailAddress}</p>
        </div>
      </div>
      <Divider />
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-medium text-white">Bio</h4>
          <p className="text-gray-300">{profile.bio || "No bio provided"}</p>
        </div>
        <div>
          <h4 className="text-lg font-medium text-white">Role</h4>
          <p className="text-gray-300 capitalize">{profile.role}</p>
        </div>
        <div>
          <h4 className="text-lg font-medium text-white">Member Since</h4>
          <p className="text-gray-300">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
