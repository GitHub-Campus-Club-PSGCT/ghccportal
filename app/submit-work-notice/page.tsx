import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";
import SubmitWorkNoticeForm from "@/components/submit-work-notice/SubmitWorkNoticeForm";
import { DBFunctions } from "@/functions/DBFunctions";
import Link from "next/link";

export async function SubmitWorkNoticePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const db = new DBFunctions();
  const profile = await db.getProfile(user.id);

  if (!profile) {
    redirect("/onboarding");
  }

  async function submitWorkNotice(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const fileUrl = formData.get("fileUrl") as string | null;

    try {
      const result = await db.createWorkNotice(
        user?.id as string,
        title,
        description,
        fileUrl!
      );
      if (result) {
        redirect("/dashboard");
      } else {
        throw new Error("Failed to submit work notice");
      }
    } catch (error) {
      console.error("Error submitting work notice:", error);
    }
  }

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-black via-gray-900 via-violet-950 via-violet-800 to-indigo-600">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-white/20 bg-opacity-10 backdrop-filter backdrop-blur-lg shadow-2xl">
          <CardHeader className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">
              Submit Work Notice
            </h2>
            {profile.role === "executive" && (
              <Link href="/evaluate-work-notices" passHref>
                <Button as="a" color="secondary">
                  Evaluate Notices
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardBody>
            <SubmitWorkNoticeForm submitWorkNotice={submitWorkNotice} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
