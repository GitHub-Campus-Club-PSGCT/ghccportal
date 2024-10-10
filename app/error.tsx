"use client";

import { useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import { Logo } from "@/components/icons";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-foreground/10">
      <Card className="w-[90%] max-w-md">
        <CardHeader className="flex gap-3 justify-center">
          <Logo width={200} height={100} />
          <div className="flex flex-col">
            <p className="text-md">Oops! Something went wrong</p>
            <p className="text-small text-default-500">Error: {error.name}</p>
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-center">
            {error.message ||
              "An unexpected error occurred. We're working on fixing it!"}
          </p>
        </CardBody>
        <CardFooter className="flex justify-center gap-2">
          <Button color="primary" onClick={() => reset()}>
            Try Again
          </Button>
          <Button
            color="secondary"
            onClick={() => (window.location.href = "/")}
          >
            Go to Homepage
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
