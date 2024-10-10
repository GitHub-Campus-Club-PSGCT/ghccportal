"use client";

import React from "react";
import { Avatar } from "@nextui-org/react";

interface Profile {
  avatar_url: string | null;
  bio: string | null;
  full_name: string;
  id: string;
  role: string;
  user_id: string;
}

interface UserInfo {
  id: string;
  email: string;
  fullName: string;
  imageUrl: string;
}

interface AccountDetailsClientProps {
  profile: Profile;
  userInfo: UserInfo;
}

export default function AccountDetailsClient({
  profile,
  userInfo,
}: AccountDetailsClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar
          src={profile.avatar_url || userInfo.imageUrl}
          name={profile.full_name}
          size="lg"
        />
        <div>
          <h3 className="text-2xl font-semibold text-white">
            {profile.full_name}
          </h3>
          <p className="text-gray-300">{userInfo.email}</p>
        </div>
      </div>
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
          <p className="text-gray-300">Not available</p>
        </div>
      </div>
    </div>
  );
}
