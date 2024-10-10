import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { DBFunctions } from "@/functions/DBFunctions";
import EvaluateWorkNoticesTable from "@/components/evaluate-work-notices/evalWorkComponent";

export async function EvaluateWorkNoticesPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const db = new DBFunctions();
  const profile = await db.getProfile(user.id);

  if (!profile || profile.role !== "executive") {
    redirect("/dashboard");
  }

  const workNotices = await db.getAllWorkNotices();

  async function approveWorkNotice(noticeId: string, points: number) {
    "use server";

    try {
      const result = await db.approveWorkNotice(
        noticeId,
        points,
        user?.id as string
      );
      if (result) {
        // You might want to revalidate the page or update the UI here
        return { success: true };
      } else {
        throw new Error("Failed to approve work notice");
      }
    } catch (error) {
      console.error("Error approving work notice:", error);
      return { success: false, error: "Failed to approve work notice" };
    }
  }

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-black via-gray-900 via-violet-950 via-violet-800 to-indigo-600">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl bg-white/20 bg-opacity-10 backdrop-filter backdrop-blur-lg shadow-2xl">
          <CardHeader>
            <h2 className="text-3xl font-bold text-white">
              Evaluate Work Notices
            </h2>
          </CardHeader>
          <CardBody>
            <EvaluateWorkNoticesTable
              workNotices={workNotices}
              approveWorkNotice={approveWorkNotice}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
