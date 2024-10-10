"use client";

import * as React from "react";
import { useSignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/dist/types/server";
import { useRouter } from "next/navigation";
import { Button, Input, Image } from "@nextui-org/react";

import { Logo } from "@/components/icons";
import { DBFunctions } from "@/functions/DBFunctions";

export default function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const router = useRouter();
  const db = new DBFunctions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }
    setPending(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        const user = await currentUser();
        const userCheck = await db.getProfile(user?.id as string);
        if (userCheck) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding");
        }
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setPending(false);
    }
  };

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
              Log in to your member account which gives you access to
              proprietary resources and tools...
            </p>
            <p className="text-sm text-gray-400 font-medium">
              We look forward to innovating with you!
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 bg-white/20 bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-2xl">
          <div>
            <Image
              alt="Logo"
              className="mx-auto lg:hidden"
              height={80}
              src="/placeholder.svg?height=80&width=80"
              width={80}
            />
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <Input
              isClearable
              isRequired
              className="text-white"
              id="email"
              label="Email"
              name="email"
              placeholder="Enter your email"
              type="email"
              value={email}
              variant="bordered"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              isClearable
              isRequired
              className="text-white"
              id="password"
              label="Password"
              name="password"
              placeholder="Enter your password"
              type="password"
              value={password}
              variant="bordered"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <a
                className="text-sm text-purple-200 hover:text-purple-300"
                href="/"
                onClick={() => {}}
              >
                Forgot password?
              </a>
            </div>
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={pending}
              type="submit"
            >
              {pending ? "Logging in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
